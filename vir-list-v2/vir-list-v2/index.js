import VirListV2 from './component/index.vue'

const virListV2Plugin = {
	install(Vue) {
		Vue.component('vir-list-v2', VirListV2)
	}
}

if (typeof window !=='undefined' && window.Vue) {
	window.Vue.use(virListV2Plugin)
}

export default virListV2Plugin