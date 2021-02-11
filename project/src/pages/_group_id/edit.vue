<template>
  <v-theme-provider light>
    <v-form ref="form">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-text-field
            v-model="groupName"
            label="勤怠ページ名*"
            outlined
            dense
            :rules="[required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="8" class="text-center">
          <v-btn color="grey" outlined large @click="submit">
            <span class="grey--text text--darken-1 font-weight-bold">
              更新
            </span>
          </v-btn>
          <v-dialog v-model="dialog" persistent max-width="290">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="red"
                outlined
                large
                class="ml-12"
                v-bind="attrs"
                v-on="on"
              >
                <span class="red--text text--darken-1 font-weight-bold">
                  削除
                </span>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">
                勤怠ページの削除
              </v-card-title>
              <v-card-text>本当に削除してよろしいですか？</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="black" text @click="del">
                  はい
                </v-btn>
                <v-btn color="black" text @click="dialog = false">
                  いいえ
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-form>
  </v-theme-provider>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import firebase from '@/plugins/firebase'
import { Group } from '@/datas/types'
import { Context } from '@nuxt/types'

@Component({
  components: {},
})
export default class Edit extends Vue {
  groupName: string = ''
  dialog: boolean = false

  required = (v: string) => !!v || '入力して下さい'

  async asyncData(context: Context) {
    const db = firebase.firestore()
    const group = db.collection('groups').doc(context.params.group_id)

    const snapshot = await group.get()
    const data = snapshot.data() as Group
    if (data) {
      const groupName = data.name
      return { groupName }
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
      .set(
        {
          name: this.groupName,
          memo: '',
        },
        { merge: true }
      )
    this.$router.push({ path: `/` })
  }

  async del() {
    this.dialog = false
    const db = firebase.firestore()
    await db
      .collection('groups')
      .doc(this.$route.params.group_id)
      .delete()
    this.$router.push({ path: `/` })
  }
}
</script>
