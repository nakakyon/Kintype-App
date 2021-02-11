<template>
  <v-theme-provider light>
    <v-row justify="center">
      <v-col v-if="memberList.length === 0" cols="12" md="8">
        利用者が追加されていません<br />
        <nuxt-link :to="`/${$route.params.group_id}/members/new`"
          >こちら</nuxt-link
        >から利用者の追加を行って下さい
      </v-col>
      <v-col v-else cols="12" md="8">
        <v-row>
          <v-col cols="5" class="font-weight-black l-border">名前</v-col>
          <v-col cols="5" class="font-weight-black l-border"
            >基本出退社時間</v-col
          >
          <v-col cols="2" class="font-weight-black lr-border">編集</v-col>
        </v-row>
        <v-row v-for="m in memberList" :key="m.id">
          <v-col cols="5" class="l-border">{{ m.name }}</v-col>
          <v-col cols="5" class="l-border">
            {{ m.startTime }}/{{ m.endTime }}
          </v-col>
          <v-col cols="2" class="lr-border">
            <v-icon style="cursor: pointer" @click="$router.push(m.route)">
              mdi-pencil
            </v-icon>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-theme-provider>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import firebase from '@/plugins/firebase'
import { Member } from '@/datas/types'
import { Context } from '@nuxt/types'

@Component({
  components: {},
})
export default class Index extends Vue {
  memberList: {
    id: string
    name: string
    startTime: string
    endTime: string
    route: string
  }[] = []

  async asyncData(context: Context) {
    const db = firebase.firestore()
    const members = db
      .collection('groups')
      .doc(context.params.group_id)
      .collection('members')

    const memberList: {
      id: string
      name: string
      startTime: string
      endTime: string
      route: string
    }[] = []

    const snapShot = await members.get()
    snapShot.docs.map(doc => {
      const data = doc.data() as Member
      memberList.push({
        id: doc.id,
        name: data.name,
        startTime: data.start_time,
        endTime: data.end_time,
        route: `/${context.params.group_id}/members/${doc.id}/edit`,
      })
    })
    return { memberList }
  }
}
</script>

<style>
.l-border {
  border-left: 1px solid lightgray;
}
.lr-border {
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
}
</style>
