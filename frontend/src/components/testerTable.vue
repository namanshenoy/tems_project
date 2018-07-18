<template>
  <v-data-table
    :headers="[{text:'Tester Name', value: 'name'}, {text: 'Status', value: 'status'}]"
    :items="testers"
    hide-actions
    item-key="name"
  >
  <template slot="items" slot-scope="props">
    <tr @click="props.expanded = !props.expanded">
      <td>{{ props.item.name }}</td>
      <td>
        <v-chip :color="getStatusFromText(props.item.status).bg" :text-color="getStatusFromText(props.item.status).text">
          <v-avatar>
          <v-icon>{{ getStatusFromText(props.item.status).icon }}</v-icon>
          </v-avatar>
          {{ props.item.status || 'NONE' }}
        </v-chip>
    </td>
    </tr>
  </template>
  <template slot="expand" slot-scope="props">
    <v-card flat color="blue-grey darken-2" class="white--text">
      <v-card-text>IGXL Version = {{ props.item.igxlVersion }}</v-card-text>
    </v-card>
  </template>
  </v-data-table>
</template>
<script>
const testerTable = {
  name: 'testerTable',
  props: {'testers': Array},
  data: () => ({}),
  methods: {
    getStatusFromText(status){
      if (status === null)
        return {bg: 'red', text: 'white', icon: 'error'}
      switch(status.toUpperCase()){
        case 'BUSY':
          return {bg: 'yellow', text: 'blue', icon: 'build'}
        case 'IDLE':
          return {bg: 'green', text: 'white', icon: 'remove_circle'}
        default:
          return {bg: 'blue', text: 'white', icon: 'warning'}
      }
    },

  },
}

export default testerTable
</script>