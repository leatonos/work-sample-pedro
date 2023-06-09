import { configureStore } from '@reduxjs/toolkit'
import assetsReducer from './assetsSlice'
import filtersReducer from './filtersSlice'

export const store = configureStore({
  reducer: {
    assets: assetsReducer,
    filters:filtersReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch