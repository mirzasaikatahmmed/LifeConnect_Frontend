'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
}

export default function BarChart({ data, width = 400, height = 300, title, className }: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([innerHeight, 0]);

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

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
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${i}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      const baseColor = d.color || '#3B82F6';
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', baseColor)
        .attr('stop-opacity', 0.9);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', baseColor)
        .attr('stop-opacity', 0.6);
    });

    // Add bars with animation
    const bars = g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.label)!)
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('fill', (d, i) => `url(#gradient-${i})`)
      .attr('rx', 4)
      .attr('ry', 4)
      .style('cursor', 'pointer');

    // Animate bars
    bars.transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('y', d => yScale(d.value))
      .attr('height', d => innerHeight - yScale(d.value));

    // Add value labels on bars
    g.selectAll('.value-label')
      .data(data)
      .enter().append('text')
      .attr('class', 'value-label')
      .attr('x', d => xScale(d.label)! + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#374151')
      .style('opacity', 0)
      .text(d => d.value.toLocaleString())
      .transition()
      .duration(800)
      .delay((d, i) => i * 100 + 400)
      .style('opacity', 1);

    // Add grid lines first (behind bars)
    g.selectAll('.grid-line-y')
      .data(yScale.ticks(5))
      .enter().append('line')
      .attr('class', 'grid-line-y')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .style('stroke', '#F3F4F6')
      .style('stroke-dasharray', '2,2')
      .style('stroke-width', 1);

    // Add x-axis
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    xAxis.selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6B7280')
      .style('font-weight', '500');

    // Add y-axis
    const yAxis = g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d3.format('.0f')(d)));

    yAxis.selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6B7280')
      .style('font-weight', '500');

    // Style axes
    g.selectAll('.domain')
      .style('stroke', '#E5E7EB')
      .style('stroke-width', 2);
    
    g.selectAll('.tick line')
      .style('stroke', '#E5E7EB')
      .style('stroke-width', 1);

    // Add hover effects
    bars
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
          .attr('transform', 'scale(1.05)');

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

        tooltip.html(`<strong>${d.label}</strong><br/>Value: ${d.value.toLocaleString()}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('transform', 'scale(1)');

        // Remove tooltip
        d3.selectAll('.tooltip').remove();
      });

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