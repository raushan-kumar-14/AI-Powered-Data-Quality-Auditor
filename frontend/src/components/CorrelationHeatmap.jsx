import Plot from "react-plotly.js";

export default function CorrelationHeatmap({ correlationMatrix }) {
  if (
    !correlationMatrix ||
    Object.keys(correlationMatrix).length === 0
  ) {
    return null;
  }

  const columns = Object.keys(correlationMatrix);

  const z = columns.map((row) =>
    columns.map((col) => correlationMatrix[row][col] ?? 0)
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Correlation Heatmap
      </h2>

      <Plot
        data={[
          {
            z,
            x: columns,
            y: columns,
            type: "heatmap",
            colorscale: "RdBu",
            zmin: -1,
            zmax: 1,
          },
        ]}
        layout={{
          autosize: true,
          height: 500,
          margin: {
            l: 80,
            r: 20,
            b: 80,
            t: 40,
          },
        }}
        style={{ width: "100%" }}
        useResizeHandler={true}
      />
    </div>
  );
}