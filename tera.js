const tera={
	nodes: [],
	lines: [],
	area: [],
	marker: [],
	loader: a=>{
		const b = new XMLHttpRequest()
		b.open('GET', a.a)
		b.onreadystatechange=()=>{b.readyState==4&&(b.status==200?a.b(b.responseText):a.c&&a.c(b.status))}
		b.send()
	},
	loadLines: a=>{
		tera.lines=[]
		tera.marker.forEach(a=>{a.remove()})
		tera.marker=[]
		tera.map.getSource('line')._data.features=[]
		tera.map.getSource('line').setData(tera.map.getSource('line')._data)
		tera.loader({a:`data/${a}.json`, b:a=>{
			tera.lines=JSON.parse(a)
			const nodes=[];
			tera.lines.forEach((a,b)=>{
				const p1=tera.nodes.find(b=>b.a==a[0])
				const p2=tera.nodes.find(b=>b.a==a[1])
				if (!nodes.find(b=>b==p1.a)) {
					tera.marker.push(new mapboxgl.Marker({draggable:true, element:el({a:'div',c:p1.a, d:{style:'padding:0 4px;font-size:10px;font-family:"Barlow Condensed";background:rgba(87,136,250,.8);border-radius:50%;'}})}).setLngLat([p1.lng, p1.lat]).addTo(tera.map))
					nodes.push(p1.a)
				}
				if (!nodes.find(b=>b==p2.a)) {
					tera.marker.push(new mapboxgl.Marker({draggable:true, element:el({a:'div',c:p2.a, d:{style:'padding:0 4px;font-size:10px;font-family:"Barlow Condensed";background:rgba(87,136,250,.8);border-radius:50%;'}})}).setLngLat([p2.lng, p2.lat]).addTo(tera.map))
					nodes.push(p2.a)
				}
				tera.map.getSource('line')._data.features.push({
					type:'Feature',
					id:b+1,
					properties:{p1:a[0], p2:a[1], color:`rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`},
					geometry:{type:'LineString',
						coordinates:tera.drawLine({
							p1:p1,
							p2:p2,
							p3:{lng:a[2][0], lat:a[2][1]}
						})
					}
				})
			})
			tera.map.getSource('line').setData(tera.map.getSource('line')._data)
		}})
	},
	initUI: ()=>{
		tera.select1=el({a:'select',b:el({a:'div',b:el({a:'div',b:tera.div,d:{style:'position:absolute;top:16px;right:16px;background:rgba(255,255,255,.5);border-radius:8px;box-shadow:0 0 6px 2px rgba(0,0,0,.1);padding:16px;'}}),c:'AREA'}).parentElement,d:{style:'padding:4px 8px;'},e:{change:a=>{
			const b=tera.area.find(b=>b.a==a.target.value)
			b&&tera.map.fitBounds(b.b)
			tera.loadLines(a.target.value)
		}}})
		tera.loader({a:'data/nodes.json', b:a=>{tera.nodes=JSON.parse(a)}})
		tera.loader({a:'data/area.json', b:a=>{
			tera.area=JSON.parse(a)
			tera.area.forEach(a=>{el({a:'option',b:tera.select1,c:a.a,d:{value:a.a,style:'padding:6px;'}})})
		}})
	},
	init:()=>{
		tera.div=el({a:'div',b:document.body,d:{style:'width:100vw;height:100vh;'}})
		tera.map = new mapboxgl.Map({container:tera.div, style: 'mapbox://styles/mapbox/light-v10', center: [117, -2.8], zoom: 4.2 })
		tera.map.on('load', ()=>{
			//['boxZoom', 'doubleClickZoom', 'doubleClickZoom', 'dragPan', 'dragRotate', 'interactive', 'keyboard', 'touchZoomRotate'].forEach(a=>{tera.map[a]&&tera.map[a].disable()})
			tera.map.getStyle().layers.forEach(a=>{(a.id==='land'||a.id==='water')||tera.map.removeLayer(a.id)})
			tera.map.setPaintProperty('land', 'background-color', 'rgba(0,0,0,.1)')//#CAD2D3
			tera.loader({a:'map.json',b:tera.draw,c:a=>{alert(a)}})
			tera.initUI()
		})
	},
	hovered: null,
	popup1: el({a:'div',b:el({a:'div',d:{style:'position:fixed;background:rgba(255,255,255,.6);border-radius:8px;box-shadow:0 0 6px 2px rgba(0,0,0,.1);padding:8px;'}}),d:{style:'background:rgba(255,255,255,.8);border-radius:8px;display:flex;flex-direction:column;gap:8px;padding:16px;'}}),
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
				tera.popup1.innerHTML=`<div>point1 : ${a.features[0].properties.p1}</div><div>point1 : ${a.features[0].properties.p2}</div>`
				document.body.appendChild(tera.popup1.parentElement)
				tera.popup1.parentElement.style.left=a.point.x+'px'
				tera.popup1.parentElement.style.top=a.point.y+'px'
				tera.map.setFeatureState({source:'line', id:tera.hovered}, {hover:true})
			}
		})
		tera.map.on('mouseleave', 'line', () => {
			tera.hovered&&(tera.map.setFeatureState({source:'line', id:tera.hovered}, {hover:false})&&document.body.removeChild(tera.popup1.parentElement))
			tera.hovered = null
		})
		tera.map.on('click', () => {
			//console.log(tera.map.getSource('map')._data)
		})
		tera.initPoint()
	},
	drawLine: a=>{
		//a[3]*=.01
		const xy=[]
		for(var t=0.0; t<=1; t+=0.05) xy.push([(1-t)*(1-t)*a.p1.lng + 2*(1-t) * t * a.p3.lng + t*t*a.p2.lng, (1-t)*(1-t)*a.p1.lat + 2*(1-t) * t * a.p3.lat + t*t*a.p2.lat])
		xy.push([a.p2.lng,a.p2.lat])
		return xy
	},
}

const initApp=()=>{
	//mapboxgl.accessToken = 'pk.eyJ1IjoicmV6YXBsZSIsImEiOiJjam1odmlld20zZmFjM3Bsazlybjk3cGJvIn0.mZTtCP_QNLKTrI-LUYYsrA'
	mapboxgl.accessToken = 'pk.eyJ1IjoibWFsLXdvb2QiLCJhIjoiY2oyZ2t2em50MDAyMzJ3cnltMDFhb2NzdiJ9.X-D4Wvo5E5QxeP7K_I3O8w'
	//mapboxgl.accessToken = 'pk.eyJ1IjoicXVlMzIxNiIsImEiOiJjaWhxZmMxMDUwMDBzdXhsdWh0ZDkyMzVqIn0.sz3lHuX9erctIPE2ya6eCw'
	//mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaiIsImEiOiJjaW43a2hyOXYwMDJrd29semd6bmZha2JuIn0.nE1hjNjGG2rlxm_oMrysyg'
	tera.init()
}
