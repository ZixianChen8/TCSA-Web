import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * A super-compact TinyLineChart component with hover tooltip.
 *
 * @param {{ data: Array<{year:string, events:number, influenced:number}>, width?: string|number, height?: number }} props
 */
const ChartRoadmap = ({
  data,
  width = '100%',
  height = 200
}) => (
  <ResponsiveContainer width={width} height={height}>
    <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
      <XAxis dataKey="year" />
      <YAxis yAxisId="left" axisLine={false} tick={false} tickLine={false} />
      <YAxis yAxisId="right" orientation="right" axisLine={false} tick={false} tickLine={false} />
      <Tooltip />
      <Legend />
      <Line
        yAxisId="left"
        type="monotone"
        dataKey="events"
        name="Events"
        stroke="#8F001A"
        strokeWidth={2}
        dot={true}
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="influenced"
        name="People influenced"
        stroke="#144AE1"
        strokeWidth={2}
        dot={true}
      />
    </LineChart>
  </ResponsiveContainer>
);

export default ChartRoadmap;
