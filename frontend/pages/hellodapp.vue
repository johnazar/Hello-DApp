<template>
  <div>
    <v-card class="mx-auto" max-width="344">
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-overline mb-4">Hello Dapp!</div>
          <v-list-item-title class="mb-1"> Current message: </v-list-item-title>
          <v-list-item-subtitle>message</v-list-item-subtitle>
          <v-list-item-title class="mb-1"> New message: </v-list-item-title>
          <v-text-field dense> </v-text-field>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-spacer></v-spacer> <v-btn class="primary"> Update message</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {}
</script>
