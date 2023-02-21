const tera={
	warna: ['rgb(255,255,255)', 'rgb(140,0,255)', 'rgb(32,31,255)', 'rgb(0,192,255)', 'rgb(1,240,0)', 'rgb(241,240,0)', 'rgb(255,192,0)', 'rgb(254,0,0)'],
	nodes: {},
	lines: [],
	area: [],
	marker: [],
	alert:[],
	loader: a=>{
		const b = new XMLHttpRequest()
		b.open('GET', a.a)
		b.onreadystatechange=()=>{b.readyState==4&&(b.status==200?a.b(b.responseText):a.c&&a.c(b.status))}
		b.send()
	},
	filterArea: a=>{
		tera.anim.active=false
		Object.keys(tera.nodes).forEach(a=>{tera.nodes[a].remove()})
		tera.lines.forEach(a=>{tera.map.setLayoutProperty(a.a, 'visibility', 'none');a.d.remove()})
		tera.loader({a:`data/${a}.json`, b:a=>{
			JSON.parse(a).filter((a,b,c)=>c.findIndex(c=>a[0]==c[0]&&a[1]==c[1])==b).forEach(a=>{
				tera.nodes[a[0]].addTo(tera.map)
				tera.nodes[a[1]].addTo(tera.map)
				tera.map.setLayoutProperty(`${a[0]}-${a[1]}`, 'visibility', 'visible')
			})
			//tera.anim.active=true
			//tera.animate()
		}})
	},
	popup1: el({a:'div',b:el({a:'div', b:el({a:'div', b:el({a:'div',b:el({a:'div',b:el({a:'div',d:{style:'position:absolute;top:0;left:16px;display:flex;align-items:center;height:calc(100% - 128px);'}}), d:{style:'background:rgba(255,255,255,.4);border-radius:8px;box-shadow:0 0 6px 2px rgba(0,0,0,.1);padding:8px;'}}), d:{style:'background:rgba(0,0,0,.8);border-radius:8px;color:rgba(255,255,255,.8);font-weight:bold;padding:4px 32px;margin-bottom:8px;position:relative;'}})}).parentElement,c:'x',d:{style:'background:rgba(255,255,255,.8);border-radius:4px;color:#000;cursor:default;font-weight:bold;padding:0 3px;position:absolute;top:3px;right:6px;'},e:{click:a=>{tera.div.removeChild(tera.popup1.parentElement.parentElement);tera.map.setFeatureState({source:tera.selected.a, id:1}, {hover:false} );tera.map.setFeatureState({source:tera.selected.a, id:2}, {hover:false} );tera.lines[tera.selected.b].d.remove();tera.selected=null}}}).parentElement.parentElement,d:{style:'background:rgba(255,255,255,.6);border-radius:8px;display:grid;grid-template-columns: auto auto;gap:4px;padding:12px;'}}),
	initUI: ()=>{
		tera.div.appendChild(tera.info)
		tera.select1=el({a:'select',b:el({a:'div',b:el({a:'div',b:tera.div,d:{style:'position:absolute;top:16px;right:16px;background:rgba(255,255,255,.5);border-radius:8px;box-shadow:0 0 6px 2px rgba(0,0,0,.1);padding:16px;'}}),c:'AREA'}).parentElement,d:{style:'padding:4px 8px;'},e:{change:a=>{
			const b=tera.area.find(b=>b.a==a.target.value)
			b&&tera.map.fitBounds(b.b)
			tera.filterArea(a.target.value)
		}}})
		tera.loader({a:'data/area.json', b:a=>{
			tera.area=JSON.parse(a)
			tera.area.forEach(a=>{el({a:'option',b:tera.select1,c:a.a,d:{value:a.a,style:'padding:6px;'}})})
		}})
		
		tera.legends=el({a:'div',b:tera.div,d:{style:'position:absolute;bottom:12px;left:16px;background:rgba(255,255,255,.4);border-radius:8px;box-shadow:0 0 6px 2px rgba(0,0,0,.1);padding:4px;'}})
		el({a:'div',b:tera.legends,c:'Traffic Load',d:{style:'background:rgba(255,255,255,.6);border-radius:8px 8px 0 0;font-weight:bold;padding:6px 0 0 16px;'}});
		(()=>{
			const a=el({a:'div',b:tera.legends,d:{style:'background:rgba(255,255,255,.6);border-radius:0 0 8px 8px;display:grid;grid-template-columns:repeat(8,48px);gap:4px 6px;padding:0 14px 6px 6px;'}})
			tera.warna.forEach(b=>{el({a:'div',b:a,d:{style:`background:${b};border:1px solid rgba(0,0,0,.4);border-radius:4px;width:32px;height:16px;justify-self:center;`}})});
			['0-1%','1-10%','10-25%','25-40%','40-55%','55-70%','70-93%','93-100%'].forEach(b=>{el({a:'div',b:a,c:b,d:{style:'justify-self:center;'}})});
		})()
		
		el({a:'div', b:tera.popup1, c:'Traffic In'})
		el({a:'div', b:tera.popup1, c:':'})
		el({a:'div', b:tera.popup1, c:'Traffic Out'})
		el({a:'div', b:tera.popup1, c:':'})
		el({a:'div', b:tera.popup1, c:'Latency'})
		el({a:'div', b:tera.popup1, c:':'})
		el({a:'div', b:tera.popup1, c:'Capacity'})
		el({a:'div', b:tera.popup1, c:':'})
		el({a:'div', b:tera.popup1, c:'Occupancy'})
		el({a:'div', b:tera.popup1, c:':'})
	},
	initData: ()=>{
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
		tera.loader({a:'data/nodes.json', b:a=>{
			const nodes={}
			JSON.parse(a).forEach((a,b)=>{
				tera.nodes[a.a]=new mapboxgl.Marker({draggable:true, element:el({a:'div',c:a.a, d:{style:'padding:0 4px;font-size:10px;font-family:"Barlow Condensed";background:rgba(87,136,250,.8);border-radius:50%;color:rgba(255,255,255,.8);'}})}).setLngLat([a.lng, a.lat]).addTo(tera.map)
				nodes[a.a]=a.b
				tera.nodes[a.a].on('dragend', a=>{
					const b=a.target.getLngLat()
					const c=a.target.getElement().textContent
					tera.lines.filter(b=>b.b==c).forEach(a=>{
						const n2=tera.nodes[a.c].getLngLat()
						const p3=a.d.getLngLat()
						const line=tera.calcCoords({...b, lng2:n2.lng, lat2:n2.lat, lng3:p3.lng, lat3:p3.lat})
						a.s._data.features[0].geometry.coordinates=line[0]
						a.s._data.features[1].geometry.coordinates=line[1]
						a.s.setData(a.s._data)
					})
					tera.lines.filter(b=>b.c==c).forEach(a=>{
						const p3=a.d.getLngLat()
						const line=tera.calcCoords({...tera.nodes[a.b].getLngLat(), lng2:b.lng, lat2:b.lat, lng3:p3.lng, lat3:p3.lat})
						a.s._data.features[0].geometry.coordinates=line[0]
						a.s._data.features[1].geometry.coordinates=line[1]
						a.s.setData(a.s._data)
					})
					
				})
			})
			tera.loader({a:'data/ALL.json', b:a=>{
				JSON.parse(a).filter((a,b,c)=>c.findIndex(c=>a[0]==c[0]&&a[1]==c[1])==b).forEach((a,b)=>{
					const {lat, lng} = tera.nodes[a[1]].getLngLat()
					const line=tera.calcCoords({...tera.nodes[a[0]].getLngLat(), lng2:lng, lat2:lat, lng3:a[2][0], lat3:a[2][1]})
					const c=a[0]+'-'+a[1]
					tera.drawLine({a:c, b:b, c:line, c1:ccol(), c2:ccol()})
					tera.lines.push({
						a:c,
						b:a[0],
						c:a[1],
						e:nodes[a[0]],
						f:nodes[a[1]],
						d:new mapboxgl.Marker({draggable:true, element:el({a:'div',c:' ', d:{'data-a':`${b}`, style:'padding:8px;background:rgba(87,136,250,1);border-radius:50%;'}})}).setLngLat({lng:a[2][0], lat:a[2][1]}),
						s:tera.map.getSource(c),
					})
					tera.lines[b].d.on('dragend', a=>{
						const b=a.target.getLngLat()
						a=tera.lines[a.target.getElement().getAttribute('data-a')]
						const n2=tera.nodes[a.c].getLngLat()
						const line=tera.calcCoords({...tera.nodes[a.b].getLngLat(), lng2:n2.lng, lat2:n2.lat, lng3:b.lng, lat3:b.lat})
						a.s._data.features[0].geometry.coordinates=line[0]
						a.s._data.features[1].geometry.coordinates=line[1]
						a.s.setData(a.s._data)
					})
				})
				tera.filterArea('ALL')
			}})
		}})
	},
	init:()=>{
		tera.div=el({a:'div',b:document.body,d:{style:'width:100vw;height:100vh;'}})
		el({a:'div',b:tera.info,c:'zoom level ='})
		tera.map = new mapboxgl.Map({container:tera.div, style: 'mapbox://styles/mapbox/light-v10', center: [117, -2.8], zoom: 4.2 })
		tera.map.on('load', ()=>{
			//['boxZoom', 'doubleClickZoom', 'doubleClickZoom', 'dragPan', 'dragRotate', 'interactive', 'keyboard', 'touchZoomRotate'].forEach(a=>{tera.map[a]&&tera.map[a].disable()})
			//tera.map.getStyle().layers.forEach(a=>{(a.id==='land'||a.id==='water')||tera.map.removeLayer(a.id)})
			//tera.map.setPaintProperty('land', 'background-color', 'rgba(0,0,0,.1)')//#CAD2D3
			tera.loader({a:'map.json',b:tera.draw,c:a=>{alert(a)}})
			tera.initData()
			tera.initUI()
		})
		el({a:'style',b:document.head,c:'@keyframes alert1{50%{font-size:24px;padding:6px;}}'})
	},
	selected: null,
	hovered: null,
	info: el({a:'div',d:{style:'position:fixed;top:8px;left:8px;background:rgba(255,255,255,.8);border-radius:8px;padding:8px;'}}),
	draw:a=>{
		tera.map.addSource('map', {type:'geojson', data:JSON.parse(a)})
		tera.map.addLayer({id:'map', type:'line', source:'map', paint:{'line-color':'rgba(255,255,255,.6)', 'line-width':['case', ['boolean', ['feature-state', 'hover'], false], 4, 2]}})
		tera.map.fitBounds([94.50, -9.01, 141.50, 6.91])
		tera.map.on('zoomend', ()=>{
			//4.48
			tera.info.children[0].textContent='zoom level = '+tera.map.getZoom()
		})
	},
	drawLine: a=>{
		tera.map.addSource(a.a, {type:'geojson', data:{type:"FeatureCollection", features:[
			{type:'Feature', id:1, properties:{a:a.a, b:a.b, color:a.c1}, geometry:{type:'LineString', coordinates:a.c[0]}},
			{type:'Feature', id:2, properties:{a:a.a, b:a.b, color:a.c2}, geometry:{type:'LineString', coordinates:a.c[1]}}
		]}})
		tera.map.addLayer({id:a.a, type:'line', source:a.a, paint:{'line-color':['get', 'color'], 'line-width':['case', ['boolean', ['feature-state', 'hover'], false], 10, 6]}})
		tera.map.on('mousemove', a.a, b=> {
			if (tera.selected!=null) return
			if (b.features.length > 0) {
				if (tera.hovered!=null) {
					tera.map.setFeatureState({source:tera.hovered, id:1}, {hover:false})
					tera.map.setFeatureState({source:tera.hovered, id:2}, {hover:false})
				}
				tera.hovered=b.features[0].properties.a
				tera.map.setFeatureState({source:tera.hovered, id:1}, {hover:true})
				tera.map.setFeatureState({source:tera.hovered, id:2}, {hover:true})
				tera.popup1.parentElement.children[0].children[0].textContent=tera.hovered
				tera.div.appendChild(tera.popup1.parentElement.parentElement)
				tera.getData(b.features[0].properties.b)
			}
		})
		tera.map.on('mouseleave', a.a, b=> {
			if (tera.selected!=null) return
			if (tera.hovered!=null) {
				tera.map.setFeatureState({source:tera.hovered, id:1}, {hover:false})
				tera.map.setFeatureState({source:tera.hovered, id:2}, {hover:false})
				tera.div.removeChild(tera.popup1.parentElement.parentElement)
				tera.hovered = null
			}
		})
		tera.map.on('click', a.a, b=> {
			if (b.originalEvent.defaultPrevented) return
			if (b.features.length > 0) {
				b.originalEvent.preventDefault()
				if (tera.selected!=null) {
					tera.map.setFeatureState({source:tera.selected.a, id:1}, {hover:false})
					tera.map.setFeatureState({source:tera.selected.a, id:2}, {hover:false})
					tera.lines[tera.selected.b].d.remove()
				}
				if (tera.hovered!=null) {
					tera.map.setFeatureState({source:tera.hovered, id:1}, {hover:false})
					tera.map.setFeatureState({source:tera.hovered, id:2}, {hover:false})
					tera.hovered=null
				}
				tera.selected={a:b.features[0].properties.a, b:b.features[0].properties.b}
				tera.map.setFeatureState({source:tera.selected.a, id:1}, {hover:true})
				tera.map.setFeatureState({source:tera.selected.a, id:2}, {hover:true})
				tera.popup1.parentElement.children[0].children[0].textContent=tera.selected.a
				tera.div.appendChild(tera.popup1.parentElement.parentElement)
				tera.lines[b.features[0].properties.b].d.addTo(tera.map)
				tera.map.moveLayer(tera.selected.a)
			}
		})
	},
	calcCoords: a=>{
		const xy=[]
		for(var t=0.0; t<=1; t+=0.05) xy.push([(1-t)*(1-t)*a.lng + 2*(1-t)*t*a.lng3 + t*t*a.lng2, (1-t)*(1-t)*a.lat + 2*(1-t)*t*a.lat3 + t*t*a.lat2])
		xy.push([a.lng2,a.lat2])
		return[xy.slice(0,Math.ceil(xy.length/2)), xy.slice(-Math.ceil(xy.length/2))]
	},
	anim: {active:false, t:0, a:0, b:1, c:1},
	animate: t=>{
		if (!tera.anim.active) return
		if (t - tera.anim.t > 100) {
			tera.anim.t = t
			if (tera.anim.c==1) {
				tera.anim.b++
				if (tera.anim.b>6)tera.anim.a++
				if (tera.anim.a>20)tera.anim.c=2
			} else {
				tera.anim.b--
				if (tera.anim.a>0)tera.anim.a--
				if (tera.anim.b<1)tera.anim.c=1
			}
			const a=tera.map.getSource('line')._data.features
			const b=[]
			const c=a.length
			for (var i=0;i<c;i+=2) {
				b.push({type:'Feature', properties:{c:'rgba(255,255,255,.8)',w:1}, geometry:{type:'LineString', coordinates:[...a[i].geometry.coordinates, ...a[i+1].geometry.coordinates.slice(1)].slice(tera.anim.a,tera.anim.b) }})
			}
			tera.map.getSource('anim').setData({type:"FeatureCollection", features:b})
		}
		requestAnimationFrame(tera.animate)
	},
	formatBytes: (bytes, decimals = 2)=>{
		if (!+bytes) return '0 Bytes'
		const k = 1024
		const dm = decimals < 0 ? 0 : decimals
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
	},
	getData: a=>{
		a=tera.lines[a]
		console.log(`http://10.62.175.157/api-rpa/path/${a.e}/${a.f}`)
		fetch(`http://10.62.175.157/api-rpa/path/${a.e}/${a.f}`).then(b=>b.json()).then(b=>{
			tera.popup1.children[5].textContent = ' : '+(b.data.latency)
			const c=b.data.raw.split('\r\n').map(a=>a.trim())
			console.log(`http://10.62.175.157/api-rpa/telemetri/${a.e}/${c[2].split(' ')[0].trim()}`)
			fetch(`http://10.62.175.157/api-rpa/telemetri/${a.e}/${c[2].split(' ')[0].trim()}`).then(b=>b.json()).then(b=>{
				tera.popup1.children[1].textContent = ' : '+(b.telemetry.bytes_received/Math.pow(2,30)).toFixed(0) +' Gbps'
				tera.popup1.children[3].textContent = ' : '+(b.telemetry.bytes_sent/Math.pow(2,30)).toFixed(0) +' Gbps'
				//console.log(b)
				//console.log(b.telemetry.raw)
				//console.log(b.telemetry.raw.split('\r\n').map(a=>a.trim()))
			})
		})
	}
}

const initApp=()=>{
	//mapboxgl.accessToken = 'pk.eyJ1IjoicmV6YXBsZSIsImEiOiJjam1odmlld20zZmFjM3Bsazlybjk3cGJvIn0.mZTtCP_QNLKTrI-LUYYsrA'
	mapboxgl.accessToken = 'pk.eyJ1IjoibWFsLXdvb2QiLCJhIjoiY2oyZ2t2em50MDAyMzJ3cnltMDFhb2NzdiJ9.X-D4Wvo5E5QxeP7K_I3O8w'
	//mapboxgl.accessToken = 'pk.eyJ1IjoicXVlMzIxNiIsImEiOiJjaWhxZmMxMDUwMDBzdXhsdWh0ZDkyMzVqIn0.sz3lHuX9erctIPE2ya6eCw'
	//mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaiIsImEiOiJjaW43a2hyOXYwMDJrd29semd6bmZha2JuIn0.nE1hjNjGG2rlxm_oMrysyg'
	tera.init()
}