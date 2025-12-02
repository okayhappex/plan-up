<script setup>
	import ListIcon from '@/components/icons/ListIcon.vue';
	import GridIcon from '@/components/icons/GridIcon.vue';

	import Task from '../components/Task.vue'

	import { ref, computed, watch, reactive, onMounted } from 'vue';


	const modules = ref([]);

	fetch('/modules.json')
		.then(res => res.json())
		.then(data => {
			modules.value = data.modules
		})
		.catch(err => console.error('Failed to load modules.json', err));


	const all = ref([]);
	const tasks = ref([]);
	const settings = reactive(JSON.parse(localStorage.getItem('settings')) || {
		viewMode: 'list',
		filter: 'all',
		filterValue: ''
	})


	watch(settings, (newSettings) => {
		localStorage.setItem('settings', JSON.stringify(newSettings));

		tasks.value = all.value.filter(task => {
			let matches = settings.filter === 'all' || task[settings.filter] === settings.filterValue;
			return (matches && new Date(task.date) >= new Date());
		});
	}, { deep: true });

	fetch('/tasks.json')
		.then(res => res.json())
		.then(data => {
			all.value = data.projects

			tasks.value = data.projects.filter(task => {
				// use reactive `settings` (defined below) for consistent access
				let matches = settings.filter === 'all' || task[settings.filter] === settings.filterValue;
				return (matches && new Date(task.date) >= new Date());
			});
		})
		.catch(err => console.error('Failed to load tasks.json', err));

	const groupedByDate = computed(() => {
		const map = new Map();
		tasks.value.forEach(t => {
			const key = (!t.date || t.date === 'unknown') ? 'unknown' : t.date;
			if (!map.has(key)) map.set(key, []);
			map.get(key).push(t);
		});

		const arr = Array.from(map.entries()).map(([date, items]) => ({ date, items }));

		arr.sort((a, b) => {
			if (a.date === 'unknown') return 1;
			if (b.date === 'unknown') return -1;

			return new Date(a.date) - new Date(b.date);
		});

		return arr;
	});

	onMounted(() => {
		const params = new URLSearchParams(window.location.search)

		if (params.get('module')) {
			settings.filter = 'module'
			settings.filterValue = params.get('module')
		}
	})
</script>
<template>
	<header class="xl:w-3/4 xl:mx-auto">
		<h1 class="bg-linear-to-br from-indigo-700 to-purple-700 bg-clip-text text-transparent text-5xl text-center font-black w-fit mx-auto">Plan-Up MMI</h1>
		<div class="text-center text-sm text-zinc-500">Gérez vos tâches et projets facilement</div>
		<div class="flex mt-4 text-center text-sm max-sm:overflow-x-scroll">
			<div class="shrink-0 flex bg-zinc-100 text-sm rounded-xl w-fit p-1 overflow-hidden dark:bg-zinc-900">
				<button
					@click="settings.viewMode = 'list'"
					:class="settings.viewMode == 'list' ? 'bg-indigo-500/10' : 'bg-transparent text-zinc-500'"
					class="cursor-pointer rounded-lg px-2 py-1 font-medium"
				>
					<ListIcon :color="settings.viewMode == 'list' ? '#615fff' : '#71717ba0'" class="inline w-5 h-5" />
				</button>
				<button
					@click="settings.viewMode = 'grid'"
					:class="settings.viewMode == 'grid' ? 'bg-indigo-600/10 text-indigo-600' : 'bg-transparent text-zinc-500'"
					class="cursor-pointer rounded-lg px-2 py-1 font-medium"
				>
					<GridIcon :color="settings.viewMode == 'grid' ? '#615fff' : '#71717ba0'" class="inline w-5 h-5" />
				</button>
			</div>
			<div v-if="settings.filter != 'all'" class="shrink flex flex-col items-center justify-center px-4">
				<p>
					<a @click="settings.filter = 'all'; settings.filterValue = ''" class="cursor-pointer text-indigo-500">Réinitialiser</a>
				</p>
			</div>
			<div class="grow"></div>
			<div class="shrink-0 flex items-center text-sm w-fit gap-2 overflow-hidden">
				<span class="text-zinc-500 font-semibold max-sm:hidden">Module:</span>
				<select
					v-model="settings.filterValue"
					@change="settings.filter = settings.filterValue ? 'module' : 'all'"
					class="bg-zinc-100 rounded-xl px-2 py-2 w-48 dark:bg-zinc-900"
				>
					<option value="">-- Tous les modules --</option>
					<option v-for="md in Object.entries(modules)" :value="md[0]">{{ md[0] }} - {{ md[1].title }}</option>
				</select>
			</div>
		</div>
	</header>
	<div v-if="tasks.length == 0" class="flex flex-col items-center justify-center">
		<p class="text-3xl font-bold">Aucune tâche à afficher.</p>
		<p>
			Essayez de
			<a @click="settings.filter = 'all'; settings.filterValue = ''" class="cursor-pointer text-indigo-500">réinitialiser les filtres</a>
		</p>
	</div>
	<div v-else>
		<main v-if="settings.viewMode == 'grid'" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:w-3/4 xl:mx-auto">
			<Task v-for="task in tasks" :key="task.id" :task="task" />
		</main>

		<main v-else class="space-y-8 md:w-2/3 md:mx-auto xl:w-1/3">
			<section v-for="group in groupedByDate" :key="group.date" class="space-y-4">
				<h2 class="text-xl text-center font-bold">{{ group.date === 'unknown' ? 'Date inconnue' : new Date(group.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</h2>
				<div class="gap-4 grid grid-cols-1">
					<Task v-for="task in group.items" :key="task.id" :task="task" />
				</div>
			</section>
		</main>
	</div>
</template>