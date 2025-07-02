"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import React from 'react'

const request = () => {
  useProtectedRoute()
  return (
    <div>
      Artist will get all the requests from organizers over here
    </div>
  )
}

export default request
