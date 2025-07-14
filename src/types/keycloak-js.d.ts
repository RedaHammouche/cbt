// src/keycloak.js
import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
    url: 'http://localhost:8085',
    realm: 'CBT',
    clientId: 'cbtclient'
})

// Configuration des événements de debugging
keycloak.onReady = (authenticated) => {
    console.log('Keycloak ready. Authenticated:', authenticated)
}

keycloak.onAuthSuccess = () => {
    console.log('Authentication successful')
}

keycloak.onAuthError = (error) => {
    console.error('Authentication error:', error)
}

keycloak.onAuthRefreshSuccess = () => {
    console.log('Token refresh successful')
}

keycloak.onAuthRefreshError = (error) => {
    console.error('Token refresh error:', error)
}

keycloak.onAuthLogout = () => {
    console.log('User logged out')
}

keycloak.onTokenExpired = () => {
    console.log('Token expired')
}

export default keycloak