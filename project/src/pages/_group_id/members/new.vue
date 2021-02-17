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
              追加
            </span>
          </v-btn>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="snackbar"
        :vertical="true"
        :timeout="10000"
        absolute
        centered
      >
        勤怠ページを作成しました<br />
        利用者の追加を行い、ページを共有しましょう
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-form>
  </v-theme-provider>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import firebase from '@/plugins/firebase'
import startEndTime from '@/components/startEndTime.vue'

@Component({
  components: { startEndTime },
})
export default class New extends Vue {
  name: string = ''
  startTime: string = '09:00'
  endTime: string = '18:00'
  snackbar: boolean = false

  required = (v: string) => !!v || '入力して下さい'

  created() {
    if (this.$route.params.init === 'init') {
      this.snackbar = true
    }
  }

  async submit() {
    if (!(this.$refs as any).form.validate()) {
      return
    }
    const db = firebase.firestore()
    await db
      .collection('groups')
      .doc(this.$route.params.group_id)
      .collection('members')
      .add({
        name: this.name,
        start_time: this.startTime,
        end_time: this.endTime,
      })

    this.$router.push({ path: `/${this.$route.params.group_id}/members` })
  }
}
</script>
