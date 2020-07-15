import {
  Component,
  ElementRef,
  Inject,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { Platform } from "@ionic/angular";
import { DOCUMENT } from "@angular/common";

import { darkStyle } from "./map-dark-style";

@Component({
  selector: "page-map",
  templateUrl: "map.html",
  styleUrls: ["./map.scss"],
})
export class MapPage implements AfterViewInit {
  @ViewChild("mapCanvas", { static: true }) mapElement: ElementRef;
  myLatLng = {
    lat: 26.794489,
    lng: -80.233234,
    name: "White Tower Software LLC",
  };
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public platform: Platform
  ) {}

  async ngAfterViewInit() {
    const appEl = this.doc.querySelector("ion-app");
    let isDark = false;
    let style = [];
    if (appEl.classList.contains("dark-theme")) {
      style = darkStyle;
    }

    const googleMaps = await getGoogleMaps(
      "AIzaSyB8pf6ZdFQj5qw7rc_HSGrhUwQKfIe9ICw"
    );

    let map;

    const mapEle = this.mapElement.nativeElement;

    map = new googleMaps.Map(mapEle, {
      center: this.myLatLng,
      zoom: 16,
      styles: style,
    });

    const infoWindow = new googleMaps.InfoWindow({
      content: `<h5>${this.myLatLng.name}</h5>`,
    });

    const marker = new googleMaps.Marker({
      position: this.myLatLng,
      map,
      title: this.myLatLng.name,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });

    googleMaps.event.addListenerOnce(map, "idle", () => {
      mapEle.classList.add("show-map");
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const el = mutation.target as HTMLElement;
          isDark = el.classList.contains("dark-theme");
          if (map && isDark) {
            map.setOptions({ styles: darkStyle });
          } else if (map) {
            map.setOptions({ styles: [] });
          }
        }
      });
    });
    observer.observe(appEl, {
      attributes: true,
    });
  }
}

function getGoogleMaps(apiKey: string): Promise<any> {
  const win = window as any;
  const googleModule = win.google;
  if (googleModule && googleModule.maps) {
    return Promise.resolve(googleModule.maps);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.31`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      const googleModule2 = win.google;
      if (googleModule2 && googleModule2.maps) {
        resolve(googleModule2.maps);
      } else {
        reject("google maps not available");
      }
    };
  });
}
