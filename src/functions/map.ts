declare const AMAP_ANIMATION_DROP: any;

declare namespace AMap {

    class Map {
        constructor(...args);

        add(...args);

        plugin(...args);

        addControl(...args);

        on(...args);
    }

    class PlaceSearch {
        constructor(...args);

        setCity(...args);

        search(...args);
    }

    class service {
        constructor(...args);
    }

    class Walking {
        constructor(...args);

        search(...args);
    }

    class Riding {
        constructor(...args);

        search(...args);
    }

    class Transfer {
        constructor(...args);

        search(...args);
    }

    class TransferPolicy {
        constructor(...args);

        LEAST_TIME;

        LEAST_FEE;

        LEAST_TRANSFER;

        LEAST_WALK;

        MOST_COMFORT;

        NO_SUBWAY;
    }

    class Driving {
        constructor(...args);

        search(...args);
    }

    class GeometryUtil {
        constructor(...args);

        distance(...args);
    }

    class Geocoder {
        constructor(...args);

        getAddress(...args);
    }

    class Geolocation {
        constructor(...args);

        getCurrentPosition(...args);
    }

    class ControlBar {
        constructor(...args);
    }

    class ToolBar {
        constructor(...args);

        getLocation(...args);
    }

    class Scale {
        constructor(...args);
    }

    class OverView {
        constructor(...args);
    }

    class Autocomplete {
        constructor(...args);
    }

    class MapType {
        constructor(...args);
    }

    class event {
        constructor(...args);

        addListener(...args);
    }

    class TileLayer {
        constructor(...args);

        Traffic(...args);
    }

    class Marker {
        constructor(...args);

        on(...args);
    }

    class InfoWindow {
        constructor(...args);

        open(...args);
    }

    class Pixel {
        constructor(...args);
    }
}

declare namespace AMapUI {

    class loadUI {
        constructor(...args);
    }
}