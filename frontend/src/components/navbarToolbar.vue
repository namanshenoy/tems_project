<template>
  <div>
    <v-navigation-drawer
      fixed
      :clipped="false"
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-tile 
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="false">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
  </div>
</template>
<script>
const navbarToolbar = {
  name: "navbarToolbar",
  data() {
    return {
      drawer: false,
      items: [
          { icon: 'bubble_chart', title: 'Inspire' }
        ],
        title: 'Testfloor Dashboard',
    }
  }
}

export default navbarToolbar
</script>