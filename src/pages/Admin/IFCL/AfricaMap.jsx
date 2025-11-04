
import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import africaGeo from "../../../data/africa.geo.json";

const AfricaMap = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const getCountryColor = (countryName) => {
    if (selectedCountry === countryName) {
      return "#FF5722"; // Orange pour le pays sélectionné
    }
    return "#607D8B"; // Gris par défaut
  };

  const handleCountryClick = (countryName) => {
    setSelectedCountry(countryName);
    console.log("Pays sélectionné :", countryName);
  };

  return <>

    <div className="container-fluid relative px-3">
      <div className="layout-specing" style={{
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
        paddingRight: "8px"
      }}>
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center" }}>Carte interactive de l'Afrique</h2>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 550,
              center: [20, 10]
            }}
            style={{ width: "100%", height: "650px" }}
          >
            <Geographies geography={africaGeo}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleCountryClick(countryName)}
                      style={{
                        default: {
                          fill: getCountryColor(countryName),
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: "#2196F3", // Bleu au survol
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#E91E63", // Rose au clic
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {selectedCountry && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                Pays sélectionné : {selectedCountry}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </>


};

export default AfricaMap;
