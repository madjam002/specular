import _ from 'lodash'

const all = []
const beatBased = []

export var AnimationRegistry = {

  all,
  beatBased,

  add(animation, isBeatBased = no) {
    all.push(animation)
    if (isBeatBased) beatBased.push(animation)
  },

  remove(animation) {
    _.remove(all, animation)
    _.remove(beatBased, animation)
  },

  updateAll(time) {
    for (let anim of all) {
      anim.update(time)
    }
  },

}
