const mApp=()=>{
const m={
	warna: ['rgb(255,255,255)', 'rgb(140,0,255)', 'rgb(32,31,255)', 'rgb(0,192,255)', 'rgb(1,240,0)', 'rgb(241,240,0)', 'rgb(255,192,0)', 'rgb(254,0,0)'],
	area: [],
	nodes: [],
	lines: [],
	lineSelected: null,
	loader: a=>{
		const b = new XMLHttpRequest()
		b.open('GET', a.a)
		b.onreadystatechange=()=>{b.readyState==4&&(b.status==200?a.b(b.responseText):a.c&&a.c(b.status))}
		b.send()
	},
	filterArea: a=>{
		m.nodes.forEach(a=>{a.remove()})
		m.lines.forEach(a=>{a.l1.remove();a.l2.remove();a.c.remove()})
		m.loader({a:`data/${a}.json`, b:a=>{
			JSON.parse(a).filter((a,b,c)=>c.findIndex(c=>a[0]==a[0]&&a[1]==c[1])==b).forEach(a=>{
				m.nodes.find(b=>b.options.b==a[0]).addTo(m.map)
				const n2=m.nodes.find(b=>b.options.b==a[1]).addTo(m.map)
				const line=m.lines.find(b=>b.a==a[0]&&b.b==a[1])
				line.l1.addTo(m.map)
				line.l2.addTo(m.map)
			})
		}})
	},
	initData: ()=>{
		const ccol=()=>{
			const a=Math.random()*100
			if (a<=1) return m.warna[0]
			if (a<=10) return m.warna[1]
			if (a<=25) return m.warna[2]
			if (a<=40) return m.warna[3]
			if (a<=55) return m.warna[4]
			if (a<=70) return m.warna[5]
			if (a<=93) return m.warna[6]
			return m.warna[7]
		}
		const lineClick=a=>{
			L.DomEvent.stopPropagation(a)
			if (m.lineSelected!=null) m.lineSelected.c.remove()
			m.lineSelected=m.lines[a.target.options.idx]
			m.lineSelected.l1.bringToFront()
			m.lineSelected.l2.bringToFront()
			m.lineSelected.c.addTo(m.map)
		}
		const lineOver=a=>{
			const b=m.lines[a.target.options.idx]
			b.l1.setStyle({weight:11})
			b.l2.setStyle({weight:11})
		}
		const lineOut=a=>{
			const b=m.lines[a.target.options.idx]
			b.l1.setStyle({weight:8})
			b.l2.setStyle({weight:8})
		}
		m.loader({a:'data/nodes.json', b:a=>{
			JSON.parse(a).forEach((a,b)=>{
				m.nodes.push(L.marker({lng:a.lng, lat:a.lat}, {a:b, b:a.a, c:a.b, icon: L.divIcon({className:'node1', iconSize:[34, 16], html:el({a:'div',c:a.a})}), draggable:true}))
				m.nodes[b].on('dragend', a=>{
					const b=a.target.getLatLng()
					m.lines.filter(b=>b.a==a.target.options.b).forEach(a=>{
						const n2=m.nodes[a.n2].getLatLng()
						const p3=a.c.getLatLng()
						const line=m.drawLine({...b, lng2:n2.lng, lat2:n2.lat, lng3:p3.lng, lat3:p3.lat})
						a.l1.setLatLngs(line[0])
						a.l2.setLatLngs(line[1])
					})
					m.lines.filter(b=>b.b==a.target.options.b).forEach(a=>{
						const p3=a.c.getLatLng()
						const line=m.drawLine({...m.nodes[a.n1].getLatLng(), lng2:b.lng, lat2:b.lat, lng3:p3.lng, lat3:p3.lat})
						a.l1.setLatLngs(line[0])
						a.l2.setLatLngs(line[1])
					})
				})
			})
			m.loader({a:'data/ALL.json', b:a=>{
				JSON.parse(a).filter((a,b,c)=>c.findIndex(c=>a[0]==a[0]&&a[1]==c[1])==b).forEach((a,b)=>{
					const n1=m.nodes.findIndex(b=>b.options.b==a[0])
					const n2=m.nodes.findIndex(b=>b.options.b==a[1])
					const {lat, lng} = m.nodes[n2].getLatLng()
					const line=m.drawLine({...m.nodes[n1].getLatLng(), lng2:lng, lat2:lat, lng3:a[2][0], lat3:a[2][1]})
					m.lines.push({
						a:a[0],
						b:a[1],
						l1:L.polyline(line[0], {idx:b, color:ccol(), lineCap:'butt', weight:8}),
						l2:L.polyline([line[1]], {idx:b, color:ccol(), lineCap:'butt', weight:8}),
						c:L.marker({lng:a[2][0], lat:a[2][1]}, {idx:b, icon: L.divIcon(), draggable:true}),
						n1:n1,
						n2:n2
					})
					m.lines[b].l1.on('click', lineClick)
					m.lines[b].l2.on('click', lineClick)
					m.lines[b].l1.on('mouseover', lineOver)
					m.lines[b].l2.on('mouseover', lineOver)
					m.lines[b].l1.on('mouseout', lineOut)
					m.lines[b].l2.on('mouseout', lineOut)
					m.lines[b].c.on('dragend', a=>{
						const b=m.lines[a.target.options.idx]
						const {lat, lng} = m.nodes[b.n2].getLatLng()
						const p3=a.target.getLatLng()
						const line=m.drawLine({...m.nodes[b.n1].getLatLng(), lng2:lng, lat2:lat, lng3:p3.lng, lat3:p3.lat})
						b.l1.setLatLngs(line[0])
						b.l2.setLatLngs(line[1])
					})
				})
				m.filterArea('ALL')
			}})
		}})
		m.loader({a:'data/area.json', b:a=>{
			m.area=JSON.parse(a)
			m.area.forEach(a=>{el({a:'option',b:m.select1,c:a.a,d:{value:a.a,style:'padding:6px;'}})})
		}})
	},
	init:()=>{
		el({a:'style',b:m.ct,c:'.node1{background:#fff;border-radius:5px;border-color:rgba(0,0,0,0);display:flex;align-items:center;justify-content:center;}'})
		el({a:'div', b:m.ct, c:'Failover Simulation', d:{style:'background:#111;color:#fff;font-size:16px;font-weight:bold;padding:14px;text-align:center;'}})
		el({a:'div', b:m.ct, c:'x', d:{style:'color:#fff;cursor:default;font-size:16px;font-weight:bold;padding:8px;position:absolute;right:8px;top:4px;'}, e:{click:a=>{document.body.removeChild(a.target.parentElement)}}})
		m.div=el({a:'div',b:m.ct,d:{style:'background:#555;flex:1;'}})
		m.map= L.map(m.div, {center:[-4, 118], zoom:5.3, zoomSnap:.01, /*preferCanvas:true,*/ zoomControl:false })
		m.map.on('click', ()=>{
			if (m.lineSelected!=null) {
				m.lineSelected.c.remove()
				m.lineSelected = null
			}
		})
		m.select1=el({a:'select',b:el({a:'div',b:el({a:'div',b:m.div,d:{style:'position:absolute;top:16px;right:16px;background:rgba(255,255,255,.5);border-radius:8px;box-shadow:0 0 6px 2px rgba(0,0,0,.1);padding:16px;'}}),c:'AREA'}).parentElement,d:{style:'padding:4px 8px;'},e:{change:a=>{
			m.map.flyToBounds(m.area.find(b=>b.a==a.target.value).b.map(a=>[a[1],a[0]]), {duration: .7})
			m.filterArea(a.target.value)
		}}})
		
		el({a:'div', b:m.popup1, c:'latency'})
		el({a:'div', b:m.popup1, c:':'})
		el({a:'div', b:m.popup1, c:'capacity'})
		el({a:'div', b:m.popup1, c:':'})
		el({a:'div', b:m.popup1, c:'traffic'})
		el({a:'div', b:m.popup1, c:':'})
		
		m.initData()
	},
	drawLine: a=>{
		const xy=[]
		for(var t=0.0; t<=1; t+=0.05) xy.push([(1-t)*(1-t)*a.lat + 2*(1-t)*t*a.lat3 + t*t*a.lat2, (1-t)*(1-t)*a.lng + 2*(1-t)*t*a.lng3 + t*t*a.lng2])
		xy.push([a.lat2,a.lng2])
		return [xy.slice(0,Math.ceil(xy.length/2)), xy.slice(-Math.ceil(xy.length/2))]
	},
	ct: el({a:'div',d:{style:'position:fixed;top:8px;left:8px;width:calc(100vw - 16px);height:calc(100vh - 16px);border-radius:16px;display:flex;flex-direction:column;overflow:hidden;'}, e:{click:a=>{a.stopPropagation()},mouseover:a=>{a.stopPropagation()},mousedown:a=>{a.stopPropagation()}}}),
	show: a=>{m.nodes.length<1?m.init():m.filterArea(a||m.select1.value)}
}

	return m
}
