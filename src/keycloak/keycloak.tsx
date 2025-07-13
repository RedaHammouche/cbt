import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8085",
  realm: "CIHTrack",
  clientId: "cih-track-client",
});

export default keycloak;