'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LineChartProps {
  data: Array<{ date: string; value: number; label?: string }>;
  width?: number;
  height?: number;
  title?: string;
  color?: string;
  className?: string;
}

export default function LineChart({ 
  data, 
  width = 500, 
  height = 300, 
  title, 
  color = '#3B82F6',
  className 
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d');
    const processedData = data.map(d => ({
      ...d,
      date: parseDate(d.date) || new Date(d.date)
    })).sort((a, b) => a.date.getTime() - b.date.getTime());

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(processedData, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.value) || 0])
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

    // Create gradient for area fill
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.3);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.05);

    // Create line generator
    const line = d3.line<{ date: Date; value: number; label?: string }>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveCardinal);

    // Create area generator
    const area = d3.area<{ date: Date; value: number; label?: string }>()
      .x(d => xScale(d.date))
      .y0(innerHeight)
      .y1(d => yScale(d.value))
      .curve(d3.curveCardinal);

    // Add area with animation
    const areaPath = g.append('path')
      .datum(processedData)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area);

    // Add line with animation
    const linePath = g.append('path')
      .datum(processedData)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', line);

    // Animate line drawing
    const totalLength = (linePath.node() as SVGPathElement).getTotalLength();
    
    linePath
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Add dots with animation
    const dots = g.selectAll('.dot')
      .data(processedData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', 0)
      .attr('fill', color)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    dots.transition()
      .duration(800)
      .delay((d, i) => i * 100 + 800)
      .attr('r', 4);

    // Add x-axis
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat('%m/%d') as any)
        .ticks(6)
      );

    xAxis.selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6B7280')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add y-axis
    const yAxis = g.append('g')
      .call(d3.axisLeft(yScale).ticks(5));

    yAxis.selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6B7280');

    // Style axes
    g.selectAll('.domain, .tick line')
      .style('stroke', '#D1D5DB');

    // Add grid lines
    g.selectAll('.grid-line-y')
      .data(yScale.ticks(5))
      .enter().append('line')
      .attr('class', 'grid-line-y')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .style('stroke', '#F3F4F6')
      .style('stroke-dasharray', '2,2');

    // Add hover effects
    dots
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6)
          .attr('stroke-width', 3);

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

        const formatDate = d3.timeFormat('%B %d, %Y');
        tooltip.html(`<strong>${formatDate(d.date)}</strong><br/>Value: ${d.value.toLocaleString()}${d.label ? `<br/>${d.label}` : ''}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 4)
          .attr('stroke-width', 2);

        // Remove tooltip
        d3.selectAll('.tooltip').remove();
      });

  }, [data, width, height, title, color]);

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