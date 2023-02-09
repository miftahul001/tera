const tera={
	marker: [],
	initPoint:()=>{
		[['P-D1-BDS', 1.124645304601902, 103.94141426927092],
		//['P-D1-BTC', 1.1157152671284873, 104.0507451570575],
		['P-D1-BKT', -0.3079456165843254, 100.37108033897674],
		['P-D1-BNA', 5.553358777701846, 95.3205660981217],
		['P-D1-BNK', -3.795909379618004, 102.26561803968907],
		//['P-D1-DRI', 0.5255583830793623, 101.44805647425981],
		['P-D1-PBR', 0.5255583830793623, 101.44805647425981],
		['P-D2-CPP', -6.173934461289109, 106.85970715134441]].forEach((b,c)=>{
			tera.marker.push(new mapboxgl.Marker({draggable: true, element:el({a:'div',c:b[0].split('-')[2], d:{style:'padding:0 4px;font-size:10px;font-family:"Barlow Condensed";background:rgba(87,136,250,.8);border-radius:50%;'},e:{click:a=>{a.stopPropagation();console.log(a.target.getBoundingClientRect());const c=/(\w+)\((.+?)\)/g.exec(a.target.style.transform)[2].split(',');console.log(parseInt(c[0])+'  '+parseInt(c[1]))}}})}).setLngLat([b[2], b[1]]).addTo(tera.map))
		})
		tera.marker[2].on('dragend', a=>{const b=a.target.getLngLat()
		tera.map.getSource('line')._data.features=[{type:'Feature', id:1, properties:{p1:'BNA', p2:'BDS', color:'rgb(0,0,0)'}, geometry:{type:'LineString', coordinates:tera.curvedLine([[b.lng, b.lat], [103.94141426927092, 1.124645304601902]])}}]
		tera.map.getSource('line').setData(tera.map.getSource('line')._data)
		})
		tera.map.getSource('line')._data.features=[{type:'Feature', id:1, properties:{p1:'BNA', p2:'BDS', color:'rgb(0,0,0)'}, geometry:{type:'LineString', coordinates:tera.curvedLine([[95.3205660981217, 5.553358777701846], [103.94141426927092, 1.124645304601902]])}}]
		tera.map.getSource('line').setData(tera.map.getSource('line')._data)
	},
	loader: a=>{
		const b = new XMLHttpRequest()
		b.open('GET', a.a)
		b.onreadystatechange=()=>{b.readyState==4&&(b.status==200?a.b(b.responseText):a.c&&a.c(b.status))}
		b.send()
	},
	init:()=>{
		tera.dlg=dlg({title:'TERA', top:32, left:32, width:832, height:432})
		tera.dlg.ct.style.overflow='hidden'
		new MutationObserver((a,b)=>{tera.map.resize()}).observe(tera.dlg.ct,{attributes:true})
		tera.map = new mapboxgl.Map({container:tera.dlg.ct, style: 'mapbox://styles/mapbox/light-v10', center: [117, -2.8], zoom: 4.2 })
		tera.map.on('load', ()=>{
			//['boxZoom', 'dragRotate', 'keyboard', 'doubleClickZoom', 'doubleClickZoom', 'touchZoomRotate'].forEach(a=>CNQ.map[a].disable())
			tera.map.getStyle().layers.forEach(a=>{(a.id==='land'||a.id==='water')||tera.map.removeLayer(a.id)})
			tera.map.setPaintProperty('land', 'background-color', 'rgba(0,0,0,.1)')//#CAD2D3
			tera.loader({a:'map.json',b:tera.draw,c:a=>{alert(a)}})
		})
	},
	hovered: null,
	draw:a=>{
		a=JSON.parse(a)
		a.features.forEach((b,c)=>{a.features[c].id=c+1})
		tera.map.addSource('map', {type:'geojson', data:a})
		tera.map.addLayer({id:'map', type:'line', source:'map', paint:{'line-color':'rgba(255,255,255,.6)', 'line-width':['case', ['boolean', ['feature-state', 'hover'], false], 4, 2]}})
		tera.map.fitBounds([95.00, -11.01, 141.50, 5.91])
		tera.map.addSource('line', {type:'geojson', data:{type:"FeatureCollection", features:[]}})
		tera.map.addLayer({id:'line', type:'line', source:'line', paint:{'line-color':['get', 'color'], 'line-width':['case', ['boolean', ['feature-state', 'hover'], false], 4, 2]}})
		tera.map.on('mousemove', 'line', a=> {
			if (a.features.length > 0) {
				tera.hovered&&tera.map.setFeatureState({source:'line', id:tera.hovered}, {hover:false} )
				tera.hovered = a.features[0].id
				tera.map.setFeatureState({source:'line', id:tera.hovered}, {hover:true})
			}
		})
		tera.map.on('mouseleave', 'line', () => {
			tera.hovered&&tera.map.setFeatureState({source:'line', id:tera.hovered}, {hover:false})
			tera.hovered = null
		})
		tera.map.on('click', () => {
			//console.log(tera.map.getSource('map')._data)
		})
		tera.initPoint()
	},
	curvedLine: a=>{
		a[0][0]<a[1][0]&&a.push(a.shift())
		const xy = []
		const theta = Math.atan2(a[1][1] - a[0][1], a[1][0] - a[0][0]) - Math.PI / 2;
		const bezierX = ((a[0][0]+a[1][0])*.5) + 10 * Math.cos(theta)
		const bezierY = ((a[0][1]+a[1][1])*.5) + 2 * Math.sin(theta)
		for(var t=0.0; t<=1; t+=0.01) xy.push([(1-t)*(1-t)*a[0][0] + 2*(1-t) * t * bezierX + t*t*a[1][0], (1-t)*(1-t)*a[0][1] + 2*(1-t) * t * bezierY + t*t*a[1][1]])
		return xy; // returns array of coordinates
	}
}

const initApp=()=>{
	//mapboxgl.accessToken = 'pk.eyJ1IjoicmV6YXBsZSIsImEiOiJjam1odmlld20zZmFjM3Bsazlybjk3cGJvIn0.mZTtCP_QNLKTrI-LUYYsrA'
	mapboxgl.accessToken = 'pk.eyJ1IjoibWFsLXdvb2QiLCJhIjoiY2oyZ2t2em50MDAyMzJ3cnltMDFhb2NzdiJ9.X-D4Wvo5E5QxeP7K_I3O8w'
	//mapboxgl.accessToken = 'pk.eyJ1IjoicXVlMzIxNiIsImEiOiJjaWhxZmMxMDUwMDBzdXhsdWh0ZDkyMzVqIn0.sz3lHuX9erctIPE2ya6eCw'
	//mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaiIsImEiOiJjaW43a2hyOXYwMDJrd29semd6bmZha2JuIn0.nE1hjNjGG2rlxm_oMrysyg'
	tera.init()
}
