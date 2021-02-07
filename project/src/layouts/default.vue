<template>
  <v-app>
    <v-app-bar fixed app color="#e3bf00">
      <v-toolbar-title
        class="font-weight-black"
        style="cursor: pointer"
        @click="$router.push('/')"
        v-text="title"
      />
      <v-spacer />
      <template v-slot:extension>
        <v-tabs v-model="activeTab" fixed-tabs color="black">
          <v-tab
            v-for="tab in tabs"
            :key="tab.id"
            :to="tab.route"
            exact
            color="black"
          >
            {{ tab.name }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-theme-provider light>
          <v-row justify="center">
            <v-col cols="12" md="8">
              <h2 class="headline font-weight-bold">
                {{ pageName }}
              </h2>
            </v-col>
          </v-row>
        </v-theme-provider>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app :absolute="true">
      <v-container>
        <v-theme-provider light>
          <v-row justify="center">
            <v-col cols="12" md="8" class="pb-0">
              <h2 class="headline font-weight-bold heading-border mb-3">
                この勤怠ページのURL
              </h2>
              <p class="mb-0">
                以下のURLをメール等を使って共有し、勤怠を連絡しましょう
              </p>
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="copyUrl"
                readonly
                outlined
                dense
                background-color="white"
              >
                <template v-slot:append-outer>
                  <v-btn color="grey" outlined @click="copyText">
                    <span class="grey--text text--darken-1 font-weight-bold">
                      コピー
                    </span>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-theme-provider>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import firebase from '@/plugins/firebase'
import { Group } from '@/datas/types'

@Component({
  components: {},
})
export default class Index extends Vue {
  items: {
    icon: string
    title: string
    to: string
  }[] = []

  title: string = 'Kintype'
  activeTab: string = ''
  tabs: {
    id: number
    name: string
    route: string
  }[] = []

  pageName: string = ''
  copyUrl: string = ''

  localStorageItem?: {
    id: string
    name: string
    expiry: Date
  }

  created() {
    const db = firebase.firestore()
    const group = db.collection('groups').doc(this.$route.params.group_id)
    group.get().then(snapshot => {
      const data = snapshot.data() as Group
      if (data) {
        this.pageName = data.name
        // @ts-ignore
        const expiration: Date = this.$moment(new Date())
          .add(1, 'M')
          .toDate()

        this.localStorageItem = {
          id: this.$route.params.group_id,
          name: data.name,
          expiry: expiration,
        }
      } else {
        this.$router.push({ path: `/` })
      }
    })

    if (
      this.$route.path.endsWith(
        `/${this.$route.params.group_id}/members/new`
      ) ||
      this.$route.path.endsWith(
        `/${this.$route.params.group_id}/members/new/init`
      )
    ) {
      this.activeTab = `/${this.$route.params.group_id}/members/new`
    } else if (
      this.$route.path.indexOf(`/${this.$route.params.group_id}/members`) === 0
    ) {
      this.activeTab = `/${this.$route.params.group_id}/members`
    } else {
      this.activeTab = `/${this.$route.params.group_id}`
    }

    this.tabs = [
      {
        id: 1,
        name: '勤怠入力',
        route: `/${this.$route.params.group_id}`,
      },
      {
        id: 2,
        name: '利用者一覧',
        route: `/${this.$route.params.group_id}/members`,
      },
      {
        id: 3,
        name: '利用者追加',
        route: `/${this.$route.params.group_id}/members/new`,
      },
    ]
  }

  mounted() {
    this.copyUrl = `${window.location.origin}/${this.$route.params.group_id}`
    if (this.localStorageItem) {
      localStorage.setItem(
        `kintype_app_${this.$route.params.group_id}`,
        JSON.stringify(this.localStorageItem)
      )
    }
  }

  copyText(): void {
    // @ts-ignore
    this.$copyText(this.copyUrl)
  }
}
</script>

<style>
.v-text-field.v-text-field--outlined .v-input__append-outer {
  margin-top: 2px !important;
}
.heading-border {
  border-image: linear-gradient(0.25turn, #e3bf00 100px, #111 100px) 1/0 0 5px 0;
  border-bottom: solid;
  display: inline-block;
}
</style>
