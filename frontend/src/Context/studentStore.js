import { create } from 'zustand'

const useStudentStore = create(set => ({
  student: null,
  setStudent: data => {
    set({ student: data })
  },
  clearStudent: () => set({ student: null })
}))

export default useStudentStore
