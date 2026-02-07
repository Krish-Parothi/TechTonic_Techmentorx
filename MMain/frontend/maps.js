const MapEngine = {
    map: null,
    layerGroup: null,

    init(id) {
        if (this.map) return;
        
        // Initialize Map
        this.map = L.map(id, {
            zoomControl: false,
            attributionControl: false,
            zoomSnap: 0.1,
        }).setView([20, 78], 4);

        // CartoDB Positron (We invert this in CSS for a perfect dark mode)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(this.map);

        this.layerGroup = L.layerGroup().addTo(this.map);
    },

    visualizeRoute(fromCoords, toCoords) {
        if(!this.map) return;
        this.layerGroup.clearLayers();

        // 1. Add Glowing Markers
        const createMarker = (color) => L.divIcon({
            className: 'custom-marker',
            html: `<div style="width:12px; height:12px; background:${color}; border-radius:50%; box-shadow:0 0 20px ${color}, 0 0 40px ${color}; border: 2px solid white;"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });

        L.marker(fromCoords, {icon: createMarker('#00f3ff')}).addTo(this.layerGroup);
        L.marker(toCoords, {icon: createMarker('#bc13fe')}).addTo(this.layerGroup);

        // 2. Draw Arc Line
        const latlngs = [fromCoords, toCoords];
        
        // Main Path
        L.polyline(latlngs, {
            color: '#fff', 
            weight: 2, 
            opacity: 0.5, 
            dashArray: '5, 10'
        }).addTo(this.layerGroup);

        // 3. Cinematic Fly-To Animation
        this.map.flyToBounds(L.latLngBounds(latlngs), {
            padding: [100, 100],
            duration: 2.5,
            easeLinearity: 0.25
        });
    }
};

window.MapEngine = MapEngine;
