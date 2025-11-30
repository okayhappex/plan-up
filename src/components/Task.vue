<script setup>
    const { task } = defineProps({
        task: {
            type: Object,
            required: true
        }
    })

    import { ref, computed, onMounted } from 'vue'

    const modules = ref({})

    onMounted(async () => {
        try {
            const res = await fetch('/modules.json')
            const data = await res.json()
            modules.value = data.modules || {}
        } catch (err) {
            console.error('Failed to load modules.json', err)
            modules.value = {}
        }
    })

    const mod = computed(() => {
        const key = task?.module
        if (!key) return null

        return modules.value[key] || null
    })

    function formatDateString(d) {
        if (!d || d === 'unknown') return 'Date inconnue'

        const dt = new Date(d)
        if (isNaN(dt)) return d

        return dt.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })
    }
</script>
<template>
    <div :data-id="task.id" class="cursor-pointer bg-white border border-slate-200 rounded-3xl p-6 duration-300 dark:bg-zinc-900 dark:border-zinc-800 hover:scale-102">
        <div class="flex">
            <div class="shrink-0 flex items-center w-10">
                <span class="text-2xl">{{ task.icon }}</span>
            </div>
            <div class="-space-y-2">
                <h3 class="text-lg font-bold">{{ task.title }}</h3>
                <span class="text-zinc-400 text-xs">Pour le {{ formatDateString(task.date) }}</span>
            </div>
        </div>
        <div>
            <p class="text-zinc-600 font-semibold">{{ task.description }}</p>
        </div>
        <div class="mt-4">
            <span class="text-indigo-500 text-sm">{{ task.module || '' }} - {{ mod ? mod.title : '' }}</span>
        </div>
    </div>
</template>