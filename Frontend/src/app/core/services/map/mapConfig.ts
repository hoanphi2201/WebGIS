export const mapConfig = {
  defaultControls: 'Mouse Position,Zoom,ScaleLineol,FullScreen,OverviewMap',
  projection: 'EPSG:900913',
  layerProjection: 'EPSG:4326',
  defaultZoom: 4,
  mcenter: [115.66283, 10.21797],
  layersGroup: [
    {
      title: 'Base maps',
      visible: true,
      layers: [
        {
          title: 'OSM',
          id: 'OSM',
          type: 'Tile',
          visible: true,
          layerType: 'base',
          dataFormat: 'OSM'
        }
      ]
    },
    
    {
      title: 'Vector-Distance',
      visible: true,
      layers: [
        {
          title: 'Vector-Distance',
          id: 'Vector-Distance',
          projection: 'EPSG:4326',
          type: 'Vector',
          visible: true,
          dataFormat: 'ServerSource',
        }
      ]
    },
    {
      title: 'Vector',
      visible: true,
      layers: [
        {
          title: 'Vector',
          id: 'Vector',
          projection: 'EPSG:4326',
          type: 'Vector',
          visible: true,
          dataFormat: 'ServerSource',
          distance: 40,
          toolTip: `<h6><strong>Thông tin địa giới</strong> </h6>
              <hr/>
              <div>Mã ĐVHC: {id}</div>
              <div>Tên ĐVHC: {name}</div>
              <div>Dân số: {population} người</div> 
              <div>Diện tích: {area} km<sup>2</sup></div>`
        }
      ]
    },
    {
      title: 'Alert Disaster',
      visible: true,
      layers: [
        {
          title: 'Alert Disaster',
          id: 'Disaster',
          projection: 'EPSG:4326',
          dataFormat: 'ServerSource',
          type: 'Cluster',
          distance: 40,
          visible: true
        }
      ]
    }
  ]
};
