import Vue from 'vue'
import Vuetify from 'vuetify'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import App from './App.vue'
import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify)

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:8000/graphql',
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
})

// Install the vue plugin
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

new Vue({ // eslint-disable-line no-new
  el: '#app',
  provide: apolloProvider.provide(),
  render: h => h(App),
})
