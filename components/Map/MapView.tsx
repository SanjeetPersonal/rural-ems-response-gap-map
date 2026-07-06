"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { buildChoroplethExpression } from "./buildChoroplethExpression";
import { Legend } from "./Legend";

const SOURCE_LAYER = "zctas";

export function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current) return;

    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [-97, 40],
      zoom: 3.4,
      minZoom: 2,
      maxZoom: 12,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    // The flex container can measure 0-wide mid-hydration, making MapLibre
    // fall back to its 400x300 default canvas and never recover. Re-sync the
    // canvas whenever the container gets its real size.
    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(containerRef.current);

    const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });

    map.on("load", () => {
      map.resize();

      map.addSource("zctas", {
        type: "vector",
        url: `pmtiles://${window.location.origin}/tiles/zcta.pmtiles`,
      });

      map.addLayer({
        id: "zcta-fill",
        type: "fill",
        source: "zctas",
        "source-layer": SOURCE_LAYER,
        paint: {
          "fill-color": buildChoroplethExpression() as maplibregl.ExpressionSpecification,
          // High enough that bucket colors read as themselves rather than
          // blending into the basemap, low enough that place labels and
          // roads underneath stay legible when zoomed in.
          "fill-opacity": 0.8,
        },
      });

      map.addLayer({
        id: "zcta-outline",
        type: "line",
        source: "zctas",
        "source-layer": SOURCE_LAYER,
        paint: {
          "line-color": "#1e293b",
          "line-width": 0.2,
          "line-opacity": 0.3,
        },
      });

      map.on("mousemove", "zcta-fill", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const feature = e.features?.[0];
        if (!feature) return;
        const { zip, estMinutes, lowConfidence } = feature.properties as {
          zip: string;
          estMinutes: number;
          lowConfidence: boolean;
        };
        popup
          .setLngLat(e.lngLat)
          .setHTML(
            `<div style="font-size:12px;line-height:1.4">` +
              `<strong>${zip}</strong><br/>` +
              `Estimated response: ~${estMinutes} min${lowConfidence ? " (low confidence)" : ""}` +
              `</div>`
          )
          .addTo(map);
      });

      map.on("mouseleave", "zcta-fill", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });

      map.on("click", "zcta-fill", (e) => {
        const feature = e.features?.[0];
        const zip = feature?.properties?.zip;
        if (zip) router.push(`/zip/${zip}`);
      });
    });

    return () => {
      resizeObserver.disconnect();
      map.remove();
      maplibregl.removeProtocol("pmtiles");
    };
  }, [router]);

  return (
    <div className="relative flex-1">
      <div ref={containerRef} className="w-full h-full" />
      <Legend />
    </div>
  );
}
