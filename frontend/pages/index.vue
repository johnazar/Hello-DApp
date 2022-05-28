<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline"> Welcome to Hello DApp </v-card-title>
        <v-card-text>
          <p>
            Here you can find a collection on Web3, Nuxt and Vuetify
            implementation
          </p>

          <p>
            Do not hesitate to try it out, source code at
            <a
              href="https://github.com/johnazar/Hello-DApp"
              target="_blank"
              rel="noopener noreferrer"
              title="github"
            >
              github </a
            >.
          </p>
          <p>
            Find a bug? Report it on the github
            <a
              href="https://github.com/johnazar/Hello-DApp/issues"
              target="_blank"
              rel="noopener noreferrer"
              title="contribute"
            >
              issue board </a
            >.
          </p>
          <p>Thank you</p>
          <div class="text-xs-right">
            <em><small>&mdash; John Azar</small></em>
          </div>
          <hr class="my-3" />
          <p>
            For more information, check out:
            <br />
            <a
              href="https://web3js.readthedocs.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web3
            </a>
            <br />
            <a
              href="https://nuxtjs.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nuxt JS
            </a>
            <br />
            <a
              href="https://vuetifyjs.com/en/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vuetify
            </a>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/unimodal"> Continue </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: 'universal',
}
</script>
