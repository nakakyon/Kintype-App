<template>
  <v-theme-provider light>
    <v-form ref="form">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-text-field
            v-model="name"
            label="名前*"
            outlined
            dense
            :rules="[required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="8">
          <start-end-time
            label-prefix="基本"
            :start-time.sync="startTime"
            :end-time.sync="endTime"
          ></start-end-time>
        </v-col>
        <v-col cols="12" md="8" class="text-center">
          <v-btn color="grey" outlined large @click="submit">
            <span class="grey--text text--darken-1 font-weight-bold">
              更新
            </span>
          </v-btn>
          <v-btn color="red" outlined large class="ml-12" @click="del">
            <span class="red--text text--darken-1 font-weight-bold">
              削除
            </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-theme-provider>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import firebase from '@/plugins/firebase'
import { Member } from '@/datas/types'
import startEndTime from '@/components/startEndTime.vue'
import { Context } from '@nuxt/types'

@Component({
  components: { startEndTime },
})
export default class Edit extends Vue {
  name: string = ''
  startTime: string = ''
  endTime: string = ''

  required = (v: string) => !!v || '入力して下さい'

  async asyncData(context: Context) {
    const db = firebase.firestore()
    const member = db
      .collection('groups')
      .doc(context.params.group_id)
      .collection('members')
      .doc(context.params.member_id)

    const snapshot = await member.get()
    const data = snapshot.data() as Member
    if (data) {
      const name = data.name
      const startTime = data.start_time
      const endTime = data.end_time
      return { name, startTime, endTime }
    }
  }

  async submit() {
    // eslint-disable-next-line
    if(!(this.$refs as any).form.validate()){
      return
    }
    const db = firebase.firestore()
    await db
      .collection('groups')
      .doc(this.$route.params.group_id)
      .collection('members')
      .doc(this.$route.params.member_id)
      .set(
        {
          name: this.name,
          start_time: this.startTime,
          end_time: this.endTime,
        },
        { merge: true }
      )
    this.$router.push({ path: `/${this.$route.params.group_id}/members` })
  }

  async del() {
    const db = firebase.firestore()
    await db
      .collection('groups')
      .doc(this.$route.params.group_id)
      .collection('members')
      .doc(this.$route.params.member_id)
      .delete()
    this.$router.push({ path: `/${this.$route.params.group_id}/members` })
  }
}
</script>
