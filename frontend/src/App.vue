<template>
  <v-app>
    <navbar-toolbar></navbar-toolbar>
    <v-content>
      <v-container fluid pr-5>
        <tester-table :testers="testers"></tester-table>
      </v-container>
    </v-content>
    <v-footer  :fixed="true" app>
      <span style="text-align:center">Teradyne &copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  import gql from 'graphql-tag'
  import testerBar from './components/testerBar'
  import navbarToolbar from './components/navbarToolbar'
  import testerTable from './components/testerTable'

  export default {
    components: {
      testerBar,
      navbarToolbar,
      testerTable,
    },
    data () {
      return {
        testers: [],
        drawer: false,
      }
    },
    apollo: {
      testers: {
        query: gql`query { 
                            getAllTesters{
                              name id igxlVersion status updated_at
                            }
                          }`,
        update: result => result.getAllTesters
      }
    }
  }
</script>
