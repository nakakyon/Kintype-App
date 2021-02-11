<template>
  <v-main>
    <section id="hero">
      <v-row no-gutters>
        <v-img min-height="100vh" :src="`${require(`@/static/top.jpg`)}`">
          <v-theme-provider dark>
            <v-container fill-height>
              <v-row
                align="center"
                class="white--text mx-auto"
                justify="center"
              >
                <v-col class="white--text text-center" cols="12" tag="h1">
                  <span
                    :class="[
                      $vuetify.breakpoint.smAndDown ? 'display-3' : 'display-4',
                    ]"
                    class="font-weight-black"
                  >
                    Kintype
                  </span>
                  <br />
                  <span
                    :class="[
                      $vuetify.breakpoint.smAndDown ? 'headline' : 'display-2',
                    ]"
                    class="font-weight-light"
                  >
                    勤怠の連絡サービス
                  </span>
                </v-col>

                <v-btn
                  class="align-self-end"
                  fab
                  outlined
                  @click="$vuetify.goTo('#about')"
                >
                  <v-icon>mdi-chevron-double-down</v-icon>
                </v-btn>
              </v-row>
            </v-container>
          </v-theme-provider>
        </v-img>
      </v-row>
    </section>

    <section id="about">
      <div class="py-12"></div>

      <v-container class="text-center">
        <h2 class="display-2 font-weight-bold mb-12 heading-border">
          Kintypeとは
        </h2>

        <!-- <v-responsive class="mx-auto mb-8" width="56">
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive> -->

        <v-responsive
          class="mx-auto title font-weight-light mb-8"
          max-width="720"
        >
          電話やメールで連絡していた勤怠を手軽に共有できるサービスです<br />
          はじめに連絡を共有したい人たちと使う勤怠ページを作成しましょう
        </v-responsive>
      </v-container>
      <div class="py-6"></div>
    </section>
    <section v-if="groupList.length > 0" id="recently">
      <div class="py-6"></div>

      <v-container class="text-center">
        <h2 class="display-2 font-weight-bold mb-12 heading-border">
          最近閲覧したページ
        </h2>

        <!-- <v-responsive class="mx-auto mb-8" width="56">
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive> -->

        <!-- <v-theme-provider light> -->
        <v-row v-for="g in groupList" :key="g.id" justify="center">
          <v-col cols="12" md="8">
            <v-card
              class="mx-auto"
              outlined
              tile
              style="cursor: pointer"
              @click="$router.push(g.route)"
            >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ g.name }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon>mdi-arrow-right</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
        <!-- </v-theme-provider> -->
      </v-container>
      <div class="py-6"></div>
    </section>
    <section id="create-page">
      <div class="py-6"></div>

      <v-container class="text-center">
        <h2 class="display-2 font-weight-bold mb-12 heading-border">
          勤怠ページ作成
        </h2>

        <!-- <v-responsive class="mx-auto mb-12" width="56">
          <v-divider class="mb-1"></v-divider>

          <v-divider></v-divider>
        </v-responsive> -->

        <v-theme-provider light>
          <v-form ref="form">
            <v-row justify="center">
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="groupName"
                  label="勤怠ページ名*"
                  placeholder="例：〇〇営業チーム"
                  outlined
                  dense
                  :rules="[required]"
                ></v-text-field>
              </v-col>

              <!-- <v-col cols="12" md="8">
              <v-textarea
                label="備考・説明"
                placeholder="例：朝の9時までに連絡しましょう"
                outlined
                dense
              ></v-textarea>
            </v-col> -->

              <v-col cols="12" md="8" class="text-center">
                <v-btn color="grey" outlined @click="submit">
                  <span class="grey--text text--darken-1 font-weight-bold">
                    作成
                  </span>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-theme-provider>
      </v-container>

      <div class="py-12"></div>
    </section>
  </v-main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { ComponentOptions } from 'vue'
import firebase from '@/plugins/firebase'
import { Group } from '@/datas/types'

@Component({
  layout: 'home',
  components: {},
} as ComponentOptions<Vue>)
export default class Index extends Vue {
  groupName: string = ''
  groupList: {
    id: string
    name: string
    route: string
  }[] = []

  required = (v: string) => !!v || '入力して下さい'

  async mounted() {
    const db = firebase.firestore()
    const removeItems = []
    for (let i = 0; i < localStorage.length; i++) {
      const key =
        localStorage.key(i) !== null ? (localStorage.key(i) as string) : ''
      const data: any =
        localStorage.getItem(key) !== null
          ? JSON.parse(localStorage.getItem(key)!)
          : {}
      if (key.startsWith('kintype_app_')) {
        const group = await db
          .collection('groups')
          .doc(data.id)
          .get()
        const gdata = group.data() as Group
        if (gdata) {
          this.groupList.push({
            id: data.id,
            name: gdata.name,
            route: `/${data.id}`,
          })
          this.setLocalStorageItem(data.id, gdata.name)
        } else {
          removeItems.push(key)
        }
      }
    }
    removeItems.map(value => {
      localStorage.removeItem(value)
    })
  }

  async submit() {
    if (!(this.$refs as any).form.validate()) {
      return
    }

    const db = firebase.firestore()
    const group = await db.collection('groups').add({
      name: this.groupName,
      memo: '',
    })
    this.setLocalStorageItem(group.id, this.groupName)
    this.$router.push({
      path: `/${group.id}/members/new/init`,
    })
  }

  setLocalStorageItem(id: string, name: string) {
    const expiry: Date = this.$moment(new Date())
      .add(1, 'M')
      .toDate()
    const item = {
      id,
      name,
      expiry,
    }
    localStorage.setItem(`kintype_app_${id}`, JSON.stringify(item))
  }
}
</script>
<style>
.heading-border {
  border-image: linear-gradient(0.25turn, #e3bf00 100px, #111 100px) 1/0 0 5px 0;
  border-bottom: solid;
  display: inline-block;
}
</style>
