const roundedRadarPlugin = {
    id: 'roundedRadar',
    afterDatasetsDraw: function (chart) {
      const ctx = chart.ctx;
  
      chart.data.datasets.forEach((dataset, index) => {
        const meta = chart.getDatasetMeta(index);
  
        meta.data.forEach((point, index) => {
          const { x, y } = point.getCenterPoint();
  
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = dataset.pointBackgroundColor[index];
          ctx.fill();
        });
      });
    },
  };
  