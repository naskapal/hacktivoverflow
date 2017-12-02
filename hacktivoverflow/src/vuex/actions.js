import firebase from 'firebase'
import firebaseui from 'firebaseui'
import firebaseConfig from './firebase.config'
import firebaseUiConfig from './firebaseui.config'

const firebaseApp = firebase.initializeApp(firebaseConfig)
const ui = new firebaseui.auth.AuthUI(firebase.auth())

let firestore = firebaseApp.firestore()
let questionDB = firestore.collection('questions')

const actions =  {
  signIn ({ dispatch }) {
    ui.start('#firebaseui-auth-container', firebaseUiConfig)
    dispatch('getUserInfo')
  },
  getUserInfo ({ commit }) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName
        var email = user.email
        // var emailVerified = user.emailVerified
        // var photoURL = user.photoURL
        // var uid = user.uid
        // var phoneNumber = user.phoneNumber
        // var providerData = user.providerData
        user.getIdToken().then(function (accessToken) {
          commit('setUserDetails', {
            displayName: displayName,
            email: email
          })
        })
      }
    }, function (error) {
      console.log(error)
    })
  },
  checkToken ({ dispatch, state }) {
    if (state.userDetails == null) {
      dispatch('signIn')
    }
  },
  getQuestions ({ commit }) {
    questionDB.get()
      .then(snapshot => commit('setQuestions', snapshot))
      .catch(err => console.log(err))
  },
  getAnswers ({ commit }, payload) {
    questionDB.doc(payload).collection('answers').get()
      .then(snapshot => commit('setAnswers', snapshot))
      .catch(err => console.log(err))
  },
  getQuestion ({ commit }, payload) {
    questionDB.doc(payload).get()
      .then(snapshot => commit('setQuestion', snapshot))
      .catch(err => console.log(err))
  },
  replyQuestion ({ dispatch }, payload) {
    questionDB.doc(payload.questionId)
      .collection('answers').add({
        answer: payload.answer
      })
      .then(ref => console.log(ref.id))
      .catch(err => console.log(err))
  },
  watchQuestions ({ commit }) {
    questionDB.onSnapshot(snapshot => {
      commit('addQuestion', snapshot)
    })
  },
  watchAnswers ({ commit }, payload) {
    questionDB.doc(payload)
      .collection('answers').onSnapshot(snapshot => {
        commit('addAnswer', snapshot)
      })
  }
}

export default actions
