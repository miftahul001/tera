const tera={
	dt: [],
	//lines: [],
	bounds: {
		'ALL':[95.00, -11.01, 141.50, 5.91],
		'Sumatera':[[87.5804035415486, -6.94445890719112], [116.84571591746732, 7.915340276124155]],
		'Jakarta':[[105.68630845036358, -6.806982298001813], [108.30052663829349, -5.483478074794576]],
		'Jawa Barat':[[106.1453089343641, -7.698828393588045], [110.03506948628046, -5.731815040905644]],
		'Jawa':[[108.2342842814287, -7.897184377681256], [112.12404483334501, -5.930986393199731]],
		'Bali Nusra':[[111.67861815601236, -11.470896156308854], [124.0572412467622, -5.237684954919516]],
		'Kalimantan':[107.18526071082897, -3.9751101734916574, 119.56388380157892, 2.32436651686956],
		'KTI':[[117.94928504048863, -7.836370189162224], [141.1661336625039, 3.958161633240664]]
	},
	marker: [],
	initPoint:()=>{
		tera.map.getSource('line')._data.features=[]
		tera.loader({a:'tera.json', b:a=>{
			a=JSON.parse(a).map(a=>([...a.slice(0,-1),...a[6].split(',').map(a=>Number(a))]))
			tera.dt=a
			var i=1
			a.forEach((b,c)=>{
				const d=b[1].split('-')[2]
				tera.marker.push(new mapboxgl.Marker({element:el({a:'div',c:d, d:{style:'padding:0 4px;font-size:10px;font-family:"Barlow Condensed";background:rgba(87,136,250,.8);border-radius:50%;'}})}).setLngLat([b[7], b[6]]).addTo(tera.map))
				//&&a.slice(c+1).forEach(a=>{
				//	if (Math.random()<.5) {
				//		//tera.lines.push([d, a[1].split('-')[2]])
				//		tera.map.getSource('line')._data.features.push({type:'Feature', id:i, properties:{p1:d, p2:a[1].split('-')[2], color:`rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`}, geometry:{type:'LineString', coordinates:tera.curvedLine([[b[7], b[6]], [a[7], a[6]]])}})
				//		i++
				//	}
				//})
			})
			tera.map.getSource('line').setData(tera.map.getSource('line')._data)
		}})
	},
	loader: a=>{
		const b = new XMLHttpRequest()
		b.open('GET', a.a)
		b.onreadystatechange=()=>{b.readyState==4&&(b.status==200?a.b(b.responseText):a.c&&a.c(b.status))}
		b.send()
	},
	initUI: ()=>{
		tera.select1=el({a:'select',b:el({a:'div',b:el({a:'div',b:tera.div,d:{style:'position:absolute;top:16px;right:16px;background:rgba(255,255,255,.5);border-radius:8px;box-shadow:0 0 6px 2px rgba(0,0,0,.1);padding:16px;'}}),c:'AREA'}).parentElement,d:{style:'padding:4px 8px;'},e:{change:a=>{
			tera.map.fitBounds(tera.bounds[a.target.value])
			tera.marker.forEach(a=>{a.remove()})
			tera.marker=[]
			tera.map.getSource('line')._data.features=[];
			const d=[]
			var i=1;
			(a.target.selectedIndex==0?tera.dt:tera.dt.filter(b=>b[3].trim()==a.target.value)).forEach(b=>{
				const c=b[1].split('-')[2]
				tera.marker.push(new mapboxgl.Marker({element:el({a:'div',c:c, d:{style:'padding:0 4px;font-size:10px;font-family:"Barlow Condensed";background:rgba(87,136,250,.8);border-radius:50%;'}})}).setLngLat([b[7], b[6]]).addTo(tera.map))
				d.forEach(d=>{
					if (Math.random()<.5) {
						//tera.lines.push([d, a[1].split('-')[2]])
						tera.map.getSource('line')._data.features.push({type:'Feature', id:i, properties:{p1:c, p2:d[0], color:`rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`}, geometry:{type:'LineString', coordinates:tera.curvedLine([[b[7], b[6]], [d[1], d[2]]])}});
						i++
					}
				})
				d.push([c,b[7],b[6]])
			})
			tera.map.getSource('line').setData(tera.map.getSource('line')._data)
		}}});
		['ALL', 'Sumatera', 'Jakarta', 'Jawa Barat', 'Jawa', 'Bali Nusra', 'Kalimantan', 'KTI'].forEach(a=>{el({a:'option',b:tera.select1,c:a,d:{value:a,style:'padding:6px;'}})})
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
	curvedLine: a=>{
		const deg2rad=(deg)=>deg * (Math.PI/180)
		const distanceFromLatLon=(lat1, lon1, lat2, lon2)=>{
			const dLat = deg2rad(lat2-lat1)	// deg2rad below
			const dLon = deg2rad(lon2-lon1)
			const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)
			return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
		}
		a[0][0]<a[1][0]&&a.push(a.shift())
		const d=distanceFromLatLon(a[0][1], a[0][0], a[1][1], a[1][0])
		const xy = []
		const theta = Math.atan2(a[1][1] - a[0][1], a[1][0] - a[0][0]) - Math.PI/2
		const bezierX = ((a[0][0]+a[1][0])*.5) + (Math.ceil(d*20)+d)*Math.cos(theta)
		const bezierY = ((a[0][1]+a[1][1])*.5) + (Math.ceil(d*20)+d)*Math.sin(theta)
		for(var t=0.0; t<=1; t+=0.02) xy.push([(1-t)*(1-t)*a[0][0] + 2*(1-t) * t * bezierX + t*t*a[1][0], (1-t)*(1-t)*a[0][1] + 2*(1-t) * t * bezierY + t*t*a[1][1]])
		xy.push([a[1][0],a[1][1]])
		return xy
	}
}

const initApp=()=>{
	//mapboxgl.accessToken = 'pk.eyJ1IjoicmV6YXBsZSIsImEiOiJjam1odmlld20zZmFjM3Bsazlybjk3cGJvIn0.mZTtCP_QNLKTrI-LUYYsrA'
	mapboxgl.accessToken = 'pk.eyJ1IjoibWFsLXdvb2QiLCJhIjoiY2oyZ2t2em50MDAyMzJ3cnltMDFhb2NzdiJ9.X-D4Wvo5E5QxeP7K_I3O8w'
	//mapboxgl.accessToken = 'pk.eyJ1IjoicXVlMzIxNiIsImEiOiJjaWhxZmMxMDUwMDBzdXhsdWh0ZDkyMzVqIn0.sz3lHuX9erctIPE2ya6eCw'
	//mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaiIsImEiOiJjaW43a2hyOXYwMDJrd29semd6bmZha2JuIn0.nE1hjNjGG2rlxm_oMrysyg'
	tera.init()
}
