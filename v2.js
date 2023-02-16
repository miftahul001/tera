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
		tera.anim.active=false
		tera.lines=[]
		tera.marker.forEach(a=>{a.remove()})
		tera.marker=[]
		tera.map.getSource('line')._data.features=[]
		tera.map.getSource('line').setData(tera.map.getSource('line')._data)
		const ccol=()=>`rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
		const nodes=[]
		var id=0;
		tera.loader({a:`data/${a}.json`, b:a=>{
			a=JSON.parse(a)
			[...new Set(a)].forEach(a=>{
				tera.lines.push({...tera.nodes.find(b=>b.a==a[0]), lng3:a[2][0], lat3:a[2][1], color:ccol()})
				tera.lines.push({...tera.nodes.find(b=>b.a==a[1]), color:ccol()})
				if (!nodes.find(b=>b==a[0])) {
					tera.marker.push(new mapboxgl.Marker({element:el({a:'div',c:a[0], d:{style:'padding:0 4px;font-size:10px;font-family:"Barlow Condensed";background:rgba(87,136,250,.8);border-radius:50%;'}})}).setLngLat([tera.lines[id].lng, tera.lines[id].lat]).addTo(tera.map))
					nodes.push(a[0])
				}
				if (!nodes.find(b=>b==a[1])) {
					tera.marker.push(new mapboxgl.Marker({element:el({a:'div',c:a[0], d:{style:'padding:0 4px;font-size:10px;font-family:"Barlow Condensed";background:rgba(87,136,250,.8);border-radius:50%;'}})}).setLngLat([tera.lines[id+1].lng, tera.lines[id+1].lat]).addTo(tera.map))
					nodes.push(a[1])
				}
				tera.drawLine(id)
				id+=2
			})
			tera.map.getSource('line').setData(tera.map.getSource('line')._data)
			tera.anim.active=true
			tera.animate()
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
	},
	init:()=>{
		tera.div=el({a:'div',b:document.body,d:{style:'width:100vw;height:100vh;'}})
		tera.map = new mapboxgl.Map({container:tera.div, style: 'mapbox://styles/mapbox/satellite-streets-v12', center: [117, -2.8], zoom: 4.2 })
		tera.map.on('load', ()=>{
			tera.loader({a:'map.json',b:tera.draw,c:a=>{alert(a)}})
			tera.initUI()
		})
	},
	hovered: null,
	popup1: el({a:'div',b:el({a:'div',b:el({a:'div',d:{style:'position:absolute;top:0;left:16px;display:flex;align-items:center;height:calc(100% - 128px);'}}), d:{style:'background:rgba(255,255,255,.4);border-radius:8px;box-shadow:0 0 6px 2px rgba(0,0,0,.1);padding:8px;'}}),d:{style:'background:rgba(255,255,255,.6);border-radius:8px;display:flex;flex-direction:column;gap:4px;padding:12px;'}}),
	draw:a=>{
		a=JSON.parse(a)
		a.features.forEach((b,c)=>{a.features[c].id=c+1})
		tera.map.addSource('map', {type:'geojson', data:a})
		tera.map.addLayer({id:'map', type:'line', source:'map', paint:{'line-color':'rgba(255,255,255,.6)', 'line-width':['case', ['boolean', ['feature-state', 'hover'], false], 2, 1]}})
		tera.map.fitBounds([95.00, -11.01, 141.50, 5.91])
		tera.map.addSource('line', {type:'geojson', data:{type:"FeatureCollection", features:[]}})
		tera.map.addLayer({id:'line', type:'line', source:'line', paint:{'line-color':['get', 'color'],'line-gap-width':1, 'line-width':['case', ['boolean', ['feature-state', 'hover'], false], 3, 1]}, layout:{'line-cap':'round', }})
		tera.map.addSource('anim', {type:'geojson', data:{type:"FeatureCollection", features:[]}})
		tera.map.addLayer({id:'anim', type:'line', source:'anim', paint:{'line-color':['get', 'c'], 'line-width':['get', 'w']}, layout:{'line-cap':'round', }})
		tera.map.on('mousemove', 'line', a=> {
			if (a.features.length > 0) {
				tera.hovered&&tera.map.setFeatureState({source:'line', id:tera.hovered}, {hover:false} )
				tera.hovered = a.features[0].id-a.features[0].id%2
				tera.popup1.innerHTML=`<div>node1 : ${tera.lines[tera.hovered].a}</div><div>node2 : ${tera.lines[tera.hovered+1].a}</div>`
				tera.div.appendChild(tera.popup1.parentElement.parentElement)
				//tera.popup1.parentElement.style.left=a.point.x+'px'
				//tera.popup1.parentElement.style.top=a.point.y+'px'
				tera.map.setFeatureState({source:'line', id:tera.hovered}, {hover:true})
				tera.map.setFeatureState({source:'line', id:tera.hovered+1}, {hover:true})
			}
		})
		tera.map.on('mouseleave', 'line', () => {
			if (tera.hovered!=null) {
				tera.map.setFeatureState({source:'line', id:tera.hovered}, {hover:false})
				tera.map.setFeatureState({source:'line', id:tera.hovered+1}, {hover:false})
				tera.div.removeChild(tera.popup1.parentElement.parentElement)
				tera.hovered = null
			}
		})
	},
	drawLine: a=>{
		const b=b=>{
			tera.map.getSource('line')._data.features.push({ type:'Feature', id:b.id, properties:{color:tera.lines[b.id].color}, geometry:{type:'LineString', coordinates:b.b } })
		}
		const xy=[]
		for(var t=0.0; t<=1; t+=0.05) xy.push([(1-t)*(1-t)*tera.lines[a].lng + 2*(1-t) * t * tera.lines[a].lng3 + t*t*tera.lines[a+1].lng, (1-t)*(1-t)*tera.lines[a].lat + 2*(1-t) * t * tera.lines[a].lat3 + t*t*tera.lines[a+1].lat])
		xy.push([tera.lines[a+1].lng,tera.lines[a+1].lat])
		b({id:a, b:xy.slice(0,Math.ceil(xy.length/2))})
		b({id:a+1, b:xy.slice(-Math.ceil(xy.length/2))})
	},
	anim: {active:false, t:0, a:0, b:1, c:1},
	animate: t=>{
		if (!tera.anim.active) return
			const b=[]
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
			const c=a.length
			for (var i=0;i<c;i+=2) {
				b.push({type:'Feature', properties:{c:'rgba(255,255,255,.8)',w:1}, geometry:{type:'LineString', coordinates:[...a[i].geometry.coordinates, ...a[i+1].geometry.coordinates.slice(1)].slice(tera.anim.a,tera.anim.b) }})
			}
			tera.map.getSource('anim').setData({type:"FeatureCollection", features:b})
		}
		requestAnimationFrame(tera.animate)
	},
}

const initApp=()=>{
	//mapboxgl.accessToken = 'pk.eyJ1IjoicmV6YXBsZSIsImEiOiJjam1odmlld20zZmFjM3Bsazlybjk3cGJvIn0.mZTtCP_QNLKTrI-LUYYsrA'
	mapboxgl.accessToken = 'pk.eyJ1IjoibWFsLXdvb2QiLCJhIjoiY2oyZ2t2em50MDAyMzJ3cnltMDFhb2NzdiJ9.X-D4Wvo5E5QxeP7K_I3O8w'
	//mapboxgl.accessToken = 'pk.eyJ1IjoicXVlMzIxNiIsImEiOiJjaWhxZmMxMDUwMDBzdXhsdWh0ZDkyMzVqIn0.sz3lHuX9erctIPE2ya6eCw'
	//mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaiIsImEiOiJjaW43a2hyOXYwMDJrd29semd6bmZha2JuIn0.nE1hjNjGG2rlxm_oMrysyg'
	tera.init()
}
