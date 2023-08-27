import { Component, effect, inject } from '@angular/core';
import L, { latLng } from 'leaflet';
import { SitesService } from 'app/services/sites.service';
import { Site } from 'app/shared/models';

@Component({
    selector: 'app-map-view',
    templateUrl: './map-view.component.html',

    standalone: true,
})
export class MapViewComponent {
    private _siteService = inject(SitesService);
    site = this._siteService.selectedSite;
    map: L.Map;

    markerIcon = {
        icon: L.icon({
            iconSize: [50, 50],
            iconUrl: 'assets/icons/marker-icon.webp',
        }),
    };

    constructor() {
        effect(() => this.initMap());
        effect(() => this.addMarker(this.map));
    }

    private initMap(): void {
        this.map = L.map('map', {
            center: [51.505, -0.09],
            zoom: 10,
            zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(this.map);
    }

    onMapReady(map: L.Map): void {
        map.invalidateSize();
    }

    onMapClick(event: L.LeafletMouseEvent): void {
        console.log(event.latlng);
    }

    private addMarker(map: L.Map, latlng?: L.LatLng): void {
        const site = this.site().data as Site;
        L.marker(site?.position ?? latlng, this.markerIcon)
            .addTo(map)
            .bindPopup(site?.name)
            .openPopup();
    }
}
