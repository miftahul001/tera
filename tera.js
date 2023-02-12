const tera={
	dt: [],
	marker: [],
	initPoint:()=>{
		/*
		tera.marker[2].on('dragend', a=>{const b=a.target.getLngLat()
		tera.map.getSource('line')._data.features[0].geometry.coordinates=tera.curvedLine([[b.lng, b.lat], [103.94141426927092, 1.124645304601902]])
		tera.map.getSource('line').setData(tera.map.getSource('line')._data)
		})
		*/
		tera.map.getSource('line')._data.features=[]
		tera.loader({a:'tera.json', b:a=>{
			a=JSON.parse(a).map(a=>([...a.slice(0,-1),...a[6].split(',').map(a=>Number(a))]))
			tera.dt=a
			var i=1
			a.forEach((b,c)=>{
				const d=b[1].split('-')[2]
				tera.marker.push(new mapboxgl.Marker({draggable: true, element:el({a:'div',c:d, d:{style:'padding:0 4px;font-size:10px;font-family:"Barlow Condensed";background:rgba(87,136,250,.8);border-radius:50%;'}})}).setLngLat([b[7], b[6]]).addTo(tera.map))
				&&a.slice(c+1).forEach(a=>{
					tera.map.getSource('line')._data.features.push({type:'Feature', id:i, properties:{p1:d, p2:a[1].split('-')[2], color:'rgb(0,0,0)'}, geometry:{type:'LineString', coordinates:tera.curvedLine([[b[7], b[6]], [a[7], a[6]]])}})
					i++
				})
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
			tera.marker.forEach(a=>{a.remove()})
			tera.marker=[]
			tera.map.getSource('line')._data.features=[];
			const d=[]
			var i=1;
			(a.target.selectedIndex==0?tera.dt:tera.dt.filter(b=>b[3].trim()==a.target.value)).forEach(b=>{
				const c=b[1].split('-')[2]
				tera.marker.push(new mapboxgl.Marker({draggable: true, element:el({a:'div',c:c, d:{style:'padding:0 4px;font-size:10px;font-family:"Barlow Condensed";background:rgba(87,136,250,.8);border-radius:50%;'}})}).setLngLat([b[7], b[6]]).addTo(tera.map))
				d.forEach(d=>{
					tera.map.getSource('line')._data.features.push({type:'Feature', id:i, properties:{p1:c, p2:d[0], color:'rgb(0,0,0)'}, geometry:{type:'LineString', coordinates:tera.curvedLine([[b[7], b[6]], [d[1], d[2]]])}});
					i++
				})
				d.push([c,b[7],b[6]])
			})
			tera.map.getSource('line').setData(tera.map.getSource('line')._data)
		}}});
		['ALL', 'Sumatera', 'Jakarta', 'Jawa Barat', 'Jawa', 'Bali Nusra', 'Kalimantan', 'KTI'].forEach(a=>{el({a:'option',b:tera.select1,c:a,d:{value:a,style:'padding:6px;'}})})
	},
	init:()=>{
		//tera.dlg=dlg({title:'TERA', top:32, left:32, width:832, height:432})
		//tera.dlg.ct.style.overflow='hidden'
		//new MutationObserver((a,b)=>{tera.map.resize()}).observe(tera.dlg.ct,{attributes:true})
		//tera.map = new mapboxgl.Map({container:tera.dlg.ct, style: 'mapbox://styles/mapbox/light-v10', center: [117, -2.8], zoom: 4.2 })
		tera.div=el({a:'div',b:document.body,d:{style:'width:100vw;height:100vh;'}})
		tera.map = new mapboxgl.Map({container:tera.div, style: 'mapbox://styles/mapbox/light-v10', center: [117, -2.8], zoom: 4.2 })
		tera.map.on('load', ()=>{
			['boxZoom', 'doubleClickZoom', 'doubleClickZoom', 'dragPan', 'dragRotate', 'interactive', 'keyboard', 'touchZoomRotate'].forEach(a=>{tera.map[a]&&tera.map[a].disable()})
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
		a[0][0]<a[1][0]&&a.push(a.shift())
		const xy = []
		const theta = Math.atan2(a[1][1] - a[0][1], a[1][0] - a[0][0]) - Math.PI / 2
		const bezierX = ((a[0][0]+a[1][0])*.5) + (1 + Math.abs(Math.abs(a[0][0])-Math.abs(a[1][0]))) * Math.cos(theta)
		const bezierY = ((a[0][1]+a[1][1])*.5) + (1 + Math.abs(Math.abs(a[0][1])-Math.abs(a[1][1]))) * Math.sin(theta)
		for(var t=0.0; t<=1; t+=0.01) xy.push([(1-t)*(1-t)*a[0][0] + 2*(1-t) * t * bezierX + t*t*a[1][0], (1-t)*(1-t)*a[0][1] + 2*(1-t) * t * bezierY + t*t*a[1][1]])
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
