const tera={
	warna: ['rgb(255,255,255)', 'rgb(140,0,255)', 'rgb(32,31,255)', 'rgb(0,192,255)', 'rgb(1,240,0)', 'rgb(241,240,0)', 'rgb(255,192,0)', 'rgb(254,0,0)'],
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
		const ccol=()=>{
			const a=Math.random()*100
			if (a<=1) return tera.warna[0]
			if (a<=10) return tera.warna[1]
			if (a<=25) return tera.warna[2]
			if (a<=40) return tera.warna[3]
			if (a<=55) return tera.warna[4]
			if (a<=70) return tera.warna[5]
			if (a<=93) return tera.warna[6]
			return tera.warna[7]
		}
		const nodes=[]
		tera.loader({a:`data/${a}.json`, b:a=>{
			var id=0;
			[...new Set(JSON.parse(a))].forEach(a=>{
				tera.lines.push({...tera.nodes.find(b=>b.a==a[0]), lng3:a[2][0], lat3:a[2][1], color:ccol()})
				tera.lines.push({...tera.nodes.find(b=>b.a==a[1]), color:ccol()})
				if (!nodes.find(b=>b==a[0])) {
					tera.marker.push(new mapboxgl.Marker({draggable:true, element:el({a:'div',c:a[0], d:{style:'padding:0 4px;font-size:10px;font-family:"Barlow Condensed";background:rgba(87,136,250,.8);border-radius:50%;'}})}).setLngLat([tera.lines[id].lng, tera.lines[id].lat]).addTo(tera.map))
					nodes.push(a[0])
				}
				if (!nodes.find(b=>b==a[1])) {
					tera.marker.push(new mapboxgl.Marker({draggable:true, element:el({a:'div',c:a[1], d:{style:'padding:0 4px;font-size:10px;font-family:"Barlow Condensed";background:rgba(87,136,250,.8);border-radius:50%;'}})}).setLngLat([tera.lines[id+1].lng, tera.lines[id+1].lat]).addTo(tera.map))
					nodes.push(a[1])
				}
				tera.drawLine(id)
				id+=2
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
			tera.loadLines('ALL')
		}})
		
		el({a:'div', b:tera.popup1, c:'Traffic In'})
		el({a:'div', b:tera.popup1, c:':'})
		el({a:'div', b:tera.popup1, c:'Traffic Out'})
		el({a:'div', b:tera.popup1, c:':'})
		el({a:'div', b:tera.popup1, c:'Latency'})
		el({a:'div', b:tera.popup1, c:':'})
		el({a:'div', b:tera.popup1, c:'Capacity'})
		el({a:'div', b:tera.popup1, c:':'})
		el({a:'div', b:tera.popup1})
		el({a:'button', b:tera.popup1, c:'Failover Simulation', d:{style:'padding: 1px 4px;'}})
		
		tera.legends=el({a:'div',b:tera.div,d:{style:'position:absolute;bottom:12px;left:16px;background:rgba(255,255,255,.4);border-radius:8px;box-shadow:0 0 6px 2px rgba(0,0,0,.1);padding:4px;'}})
		el({a:'div',b:tera.legends,c:'Traffic Load',d:{style:'background:rgba(255,255,255,.6);border-radius:8px 8px 0 0;font-weight:bold;padding:6px 0 0 16px;'}});
		(()=>{
			const a=el({a:'div',b:tera.legends,d:{style:'background:rgba(255,255,255,.6);border-radius:0 0 8px 8px;display:grid;grid-template-columns:repeat(8,48px);gap:4px 6px;padding:0 14px 6px 6px;'}});
			['0-1%','1-10%','10-25%','25-40%','40-55%','55-70%','70-93%','93-100%'].forEach(b=>{el({a:'div',b:a,c:b,d:{style:'justify-self:center;'}})});
			tera.warna.forEach(b=>{el({a:'div',b:a,d:{style:`background:${b};border:1px solid rgba(0,0,0,.4);border-radius:4px;width:32px;height:16px;justify-self:center;`}})})
		})()
	},
	init:()=>{
		tera.div=el({a:'div',b:document.body,d:{style:'width:100vw;height:100vh;'}})
		tera.map = new mapboxgl.Map({container:tera.div, style: 'mapbox://styles/mapbox/light-v10', center: [117, -2.8], zoom: 4.2 })
		tera.map.on('load', ()=>{
			//['boxZoom', 'doubleClickZoom', 'doubleClickZoom', 'dragPan', 'dragRotate', 'interactive', 'keyboard', 'touchZoomRotate'].forEach(a=>{tera.map[a]&&tera.map[a].disable()})
			//tera.map.getStyle().layers.forEach(a=>{(a.id==='land'||a.id==='water')||tera.map.removeLayer(a.id)})
			//tera.map.setPaintProperty('land', 'background-color', 'rgba(0,0,0,.1)')//#CAD2D3
			tera.loader({a:'map.json',b:tera.draw,c:a=>{alert(a)}})
			tera.initUI()
		})
	},
	selected: null,
	hovered: null,
	popup1: el({a:'div',b:el({a:'div', b:el({a:'div', b:el({a:'div',b:el({a:'div',b:el({a:'div',d:{style:'position:absolute;top:0;left:16px;display:flex;align-items:center;height:calc(100% - 128px);'}}), d:{style:'background:rgba(255,255,255,.4);border-radius:8px;box-shadow:0 0 6px 2px rgba(0,0,0,.1);padding:8px;'}}), d:{style:'background:rgba(0,0,0,.8);border-radius:8px;color:rgba(255,255,255,.8);font-weight:bold;padding:4px 32px;margin-bottom:8px;position:relative;'}})}).parentElement,c:'x',d:{style:'background:rgba(255,255,255,.8);border-radius:4px;color:#000;cursor:default;font-weight:bold;padding:0 3px;position:absolute;top:3px;right:6px;'},e:{click:a=>{tera.div.removeChild(tera.popup1.parentElement.parentElement);tera.map.setFeatureState({source:'line', id:tera.selected}, {hover:false} );tera.map.setFeatureState({source:'line', id:tera.selected+1}, {hover:false} );tera.selected=null}}}).parentElement.parentElement,d:{style:'background:rgba(255,255,255,.6);border-radius:8px;display:grid;grid-template-columns: auto auto;gap:4px;padding:12px;'}}),
	draw:a=>{
		a=JSON.parse(a)
		a.features.forEach((b,c)=>{a.features[c].id=c+1})
		tera.map.addSource('map', {type:'geojson', data:a})
		tera.map.addLayer({id:'map', type:'line', source:'map', paint:{'line-color':'rgba(255,255,255,.6)', 'line-width':['case', ['boolean', ['feature-state', 'hover'], false], 4, 2]}})
		tera.map.fitBounds([95.00, -11.01, 141.50, 5.91])
		tera.map.addSource('line', {type:'geojson', data:{type:"FeatureCollection", features:[]}})
		tera.map.addLayer({id:'line', type:'line', source:'line', paint:{'line-color':'#000000', 'line-gap-width':3, 'line-width':['case', ['boolean', ['feature-state', 'hover'], false], 3, 1]}})
		tera.map.addLayer({id:'line2', type:'line', source:'line', paint:{'line-color':['get', 'color'], 'line-width':['case', ['boolean', ['feature-state', 'hover'], false], 3, 3]}})
		tera.map.on('mousemove', 'line', a=> {
			if (tera.selected!=null) return
			if (a.features.length > 0) {
				tera.hovered!=null&&tera.map.setFeatureState({source:'line', id:tera.hovered}, {hover:false} )
				tera.hovered!=null&&tera.map.setFeatureState({source:'line', id:tera.hovered+1}, {hover:false} )
				tera.hovered = a.features[0].id-a.features[0].id%2
				tera.popup1.parentElement.children[0].children[0].textContent = `${tera.lines[tera.hovered].a} - ${tera.lines[tera.hovered+1].a}`
				tera.div.appendChild(tera.popup1.parentElement.parentElement)
				tera.map.setFeatureState({source:'line', id:tera.hovered}, {hover:true})
				tera.map.setFeatureState({source:'line', id:tera.hovered+1}, {hover:true})
			}
		})
		tera.map.on('mouseleave', 'line', () => {
			if (tera.selected!=null) return
			if (tera.hovered!=null) {
				tera.map.setFeatureState({source:'line', id:tera.hovered}, {hover:false})
				tera.map.setFeatureState({source:'line', id:tera.hovered+1}, {hover:false})
				tera.div.removeChild(tera.popup1.parentElement.parentElement)
				tera.hovered = null
			}
		})
		tera.map.on('click', 'line', a=> {
			if (a.features.length > 0) {
				tera.selected!=null&&tera.map.setFeatureState({source:'line', id:tera.selected}, {hover:false} )
				tera.selected!=null&&tera.map.setFeatureState({source:'line', id:tera.selected+1}, {hover:false} )
				tera.hovered!=null&&tera.map.setFeatureState({source:'line', id:tera.hovered}, {hover:false} )
				tera.hovered!=null&&tera.map.setFeatureState({source:'line', id:tera.hovered+1}, {hover:false} )
				tera.selected = a.features[0].id-a.features[0].id%2
				tera.popup1.parentElement.children[0].children[0].textContent = `${tera.lines[tera.selected].a} - ${tera.lines[tera.selected+1].a}`
				tera.div.appendChild(tera.popup1.parentElement.parentElement)
				tera.map.setFeatureState({source:'line', id:tera.selected}, {hover:true})
				tera.map.setFeatureState({source:'line', id:tera.selected+1}, {hover:true})
			}
		})
	},
	drawLine: a=>{
		const b=b=>{tera.map.getSource('line')._data.features.push({ type:'Feature', id:b.id, properties:{color:tera.lines[b.id].color}, geometry:{type:'LineString', coordinates:b.b } })}
		const xy=[]
		for(var t=0.0; t<=1; t+=0.05) xy.push([(1-t)*(1-t)*tera.lines[a].lng + 2*(1-t) * t * tera.lines[a].lng3 + t*t*tera.lines[a+1].lng, (1-t)*(1-t)*tera.lines[a].lat + 2*(1-t) * t * tera.lines[a].lat3 + t*t*tera.lines[a+1].lat])
		xy.push([tera.lines[a+1].lng,tera.lines[a+1].lat])
		b({id:a, b:xy.slice(0,Math.ceil(xy.length/2))})
		b({id:a+1, b:xy.slice(-Math.ceil(xy.length/2))})
	},
}

const initApp=()=>{
	//mapboxgl.accessToken = 'pk.eyJ1IjoicmV6YXBsZSIsImEiOiJjam1odmlld20zZmFjM3Bsazlybjk3cGJvIn0.mZTtCP_QNLKTrI-LUYYsrA'
	mapboxgl.accessToken = 'pk.eyJ1IjoibWFsLXdvb2QiLCJhIjoiY2oyZ2t2em50MDAyMzJ3cnltMDFhb2NzdiJ9.X-D4Wvo5E5QxeP7K_I3O8w'
	//mapboxgl.accessToken = 'pk.eyJ1IjoicXVlMzIxNiIsImEiOiJjaWhxZmMxMDUwMDBzdXhsdWh0ZDkyMzVqIn0.sz3lHuX9erctIPE2ya6eCw'
	//mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaiIsImEiOiJjaW43a2hyOXYwMDJrd29semd6bmZha2JuIn0.nE1hjNjGG2rlxm_oMrysyg'
	tera.init()
}
