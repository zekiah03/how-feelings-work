'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { Core, NodeSingular } from 'cytoscape';
import { emotions, categoryColors, transitionTypeColors } from '@/lib/emotions';
import type { EmotionCategory } from '@/lib/emotions';

interface EmotionGraphProps {
  selectedId: string | null;
  filterCategory: EmotionCategory | 'all';
  onSelectEmotion: (id: string) => void;
}

export default function EmotionGraph({
  selectedId,
  filterCategory,
  onSelectEmotion,
}: EmotionGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  const buildElements = useCallback(() => {
    const visibleEmotions =
      filterCategory === 'all'
        ? emotions
        : emotions.filter((e) => e.category === filterCategory);
    const visibleIds = new Set(visibleEmotions.map((e) => e.id));

    const nodes = visibleEmotions.map((e) => ({
      data: {
        id: e.id,
        label: e.name,
        category: e.category,
        color: categoryColors[e.category],
      },
    }));

    const edges: { data: { id: string; source: string; target: string; label: string; transitionType: string; edgeColor: string } }[] = [];
    visibleEmotions.forEach((e) => {
      e.transitions.forEach((t, i) => {
        if (visibleIds.has(t.to)) {
          edges.push({
            data: {
              id: `${e.id}-${t.to}-${i}`,
              source: e.id,
              target: t.to,
              label: t.label,
              transitionType: t.type,
              edgeColor: transitionTypeColors[t.type],
            },
          });
        }
      });
    });

    return [...nodes, ...edges];
  }, [filterCategory]);

  useEffect(() => {
    if (!containerRef.current) return;

    let cy: Core;

    const init = async () => {
      const cytoscape = (await import('cytoscape')).default;

      cy = cytoscape({
        container: containerRef.current,
        elements: buildElements(),
        style: [
          {
            selector: 'node',
            style: {
              'background-color': 'data(color)',
              label: 'data(label)',
              color: '#ffffff',
              'font-size': '11px',
              'font-family': '"Noto Sans JP", sans-serif',
              'font-weight': 600,
              'text-valign': 'center',
              'text-halign': 'center',
              'text-wrap': 'wrap',
              'text-max-width': '70px',
              width: '72px',
              height: '72px',
              'border-width': '2px',
              'border-color': 'rgba(255,255,255,0.3)',
              'transition-property': 'border-width, border-color, width, height',
              'transition-duration': 150,
            },
          },
          {
            selector: 'node:hover',
            style: {
              'border-width': '3px',
              'border-color': '#ffffff',
              width: '80px',
              height: '80px',
              'z-index': 10,
            },
          },
          {
            selector: 'node.selected',
            style: {
              'border-width': '4px',
              'border-color': '#ffffff',
              width: '88px',
              height: '88px',
              'z-index': 20,
            },
          },
          {
            selector: 'node.dimmed',
            style: {
              opacity: 0.25,
            },
          },
          {
            selector: 'edge',
            style: {
              width: 1.5,
              'line-color': 'data(edgeColor)',
              'target-arrow-color': 'data(edgeColor)',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              label: 'data(label)',
              'font-size': '8px',
              color: 'rgba(255,255,255,0.5)',
              'font-family': '"Noto Sans JP", sans-serif',
              'text-rotation': 'autorotate',
              'text-background-color': '#0f172a',
              'text-background-opacity': 0.7,
              'text-background-padding': '2px',
              opacity: 0.45,
              'transition-property': 'opacity',
              'transition-duration': 150,
            },
          },
          {
            selector: 'edge.highlighted',
            style: {
              width: 2.5,
              opacity: 1,
              color: 'rgba(255,255,255,0.9)',
              'z-index': 10,
            },
          },
          {
            selector: 'edge.dimmed',
            style: {
              opacity: 0.05,
            },
          },
        ],
        layout: {
          name: 'cose',
          animate: true,
          animationDuration: 600,
          nodeRepulsion: () => 8000,
          idealEdgeLength: () => 120,
          edgeElasticity: () => 100,
          gravity: 0.3,
          numIter: 500,
          randomize: false,
          fit: true,
          padding: 40,
        } as never,
        userZoomingEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false,
        minZoom: 0.3,
        maxZoom: 3,
      });

      cyRef.current = cy;

      cy.on('tap', 'node', (evt) => {
        const id = evt.target.id() as string;
        onSelectEmotion(id);
      });

      cy.on('tap', (evt) => {
        if (evt.target === cy) {
          onSelectEmotion('');
        }
      });
    };

    init();

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory]);

  // Handle selection highlighting
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.nodes().removeClass('selected dimmed');
    cy.edges().removeClass('highlighted dimmed');

    if (!selectedId) return;

    const selected = cy.getElementById(selectedId);
    if (!selected.length) return;

    selected.addClass('selected');

    const connectedEdges = selected.connectedEdges();
    const connectedNodes = connectedEdges.connectedNodes();

    cy.nodes().not(selected).not(connectedNodes).addClass('dimmed');
    cy.edges().not(connectedEdges).addClass('dimmed');
    connectedEdges.addClass('highlighted');
  }, [selectedId]);

  // Update elements when filter changes
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().remove();
    cy.add(buildElements());
    cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 400,
      nodeRepulsion: () => 8000,
      idealEdgeLength: () => 120,
      fit: true,
      padding: 40,
    } as never).run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, buildElements]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
}
