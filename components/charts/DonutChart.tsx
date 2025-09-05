'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DonutChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
}

export default function DonutChart({ data, width = 300, height = 300, title, className }: DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;
    const innerRadius = radius * 0.6;

    // Color scale
    const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(data.map((d, i) => d.color || defaultColors[i % defaultColors.length]));

    // Create pie generator
    const pie = d3.pie<{ label: string; value: number; color?: string }>()
      .value(d => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number; color?: string }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(3);

    const hoverArc = d3.arc<d3.PieArcDatum<{ label: string; value: number; color?: string }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius + 10)
      .cornerRadius(3);

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`);

    // Add title
    if (title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .style('fill', '#374151')
        .text(title);
    }

    // Create gradient definitions
    const defs = svg.append('defs');
    data.forEach((d, i) => {
      const gradient = defs.append('radialGradient')
        .attr('id', `radial-gradient-${i}`)
        .attr('cx', '30%')
        .attr('cy', '30%');

      const baseColor = d.color || defaultColors[i % defaultColors.length];
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d3.color(baseColor)!.brighter(0.5).toString())
        .attr('stop-opacity', 0.9);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', baseColor)
        .attr('stop-opacity', 1);
    });

    // Create arcs with animation
    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    // Add paths
    const paths = arcs.append('path')
      .attr('fill', (d, i) => `url(#radial-gradient-${i})`)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .attr('d', d3.arc<d3.PieArcDatum<any>>().innerRadius(innerRadius).outerRadius(0));

    // Animate paths
    paths.transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(
          { startAngle: d.startAngle, endAngle: d.startAngle },
          d
        );
        return function(t) {
          const interpolated = interpolate(t);
          return arc(interpolated as any) || '';
        };
      });

    // Add percentage labels
    const labelArcs = arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d as any)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .style('opacity', 0)
      .text(d => {
        const total = d3.sum(data, d => d.value);
        const percentage = ((d.value / total) * 100).toFixed(1);
        return percentage + '%';
      });

    labelArcs.transition()
      .duration(800)
      .delay((d, i) => i * 100 + 400)
      .style('opacity', 1);

    // Add hover effects
    paths
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', hoverArc(d as any) || '');

        // Show tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px 12px')
          .style('border-radius', '6px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('opacity', 0);

        tooltip.transition()
          .duration(200)
          .style('opacity', 1);

        const total = d3.sum(data, d => d.value);
        const percentage = ((d.value / total) * 100).toFixed(1);

        tooltip.html(`<strong>${d.data.label}</strong><br/>Value: ${d.value.toLocaleString()}<br/>Percentage: ${percentage}%`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc(d as any) || '');

        // Remove tooltip
        d3.selectAll('.tooltip').remove();
      });

    // Add center text showing total
    const total = d3.sum(data, d => d.value);
    const centerGroup = g.append('g')
      .attr('class', 'center-text');

    centerGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('fill', '#374151')
      .text(total.toLocaleString());

    centerGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '12px')
      .style('fill', '#6B7280')
      .text('Total');

    // Add legend below the chart
    const legendY = height - 60;
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width/2}, ${legendY})`);

    // Calculate legend layout
    const itemsPerRow = Math.min(data.length, 4);
    const itemWidth = 80;
    const startX = -(itemsPerRow * itemWidth) / 2;

    const legendItems = legend.selectAll('.legend-item')
      .data(data)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => {
        const row = Math.floor(i / itemsPerRow);
        const col = i % itemsPerRow;
        return `translate(${startX + col * itemWidth}, ${row * 18})`;
      });

    legendItems.append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d, i) => d.color || defaultColors[i % defaultColors.length])
      .attr('rx', 2);

    legendItems.append('text')
      .attr('x', 15)
      .attr('y', 8)
      .style('font-size', '11px')
      .style('fill', '#374151')
      .style('font-weight', '500')
      .text(d => d.label);

  }, [data, width, height, title]);

  return (
    <div className={className}>
      <svg 
        ref={svgRef} 
        width={width} 
        height={height}
        className="drop-shadow-sm"
      />
    </div>
  );
}