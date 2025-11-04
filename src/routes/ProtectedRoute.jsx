/* eslint-disable react/prop-types */


// "use client"
// import { Navigate, Outlet } from "react-router-dom"
// import { useAuth } from "../hooks/useAuth"
// import { Spin } from "antd"

// export const ProtectedRoute = ({
//   allowedRoles = [],
//   requiredPermissions = [],
//   requireAllPermissions = false,
//   children
// }) => {
//   const { user, isAuthenticated, loading, logout } = useAuth()

//   // Pendant le chargement
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Spin size="large" />
//       </div>
//     )
//   }

//   // Non authentifié
//   if (!isAuthenticated || !user) {
//     return <Navigate to="/auth/login" replace />
//   }

//   // Utilisateur inactif
//   if (user.status === "INACTIVE") {
//     logout()
//     return <Navigate to="/auth/lock-screen" replace />
//   }

//   // Vérification des rôles
//   const hasAllowedRole = allowedRoles.length === 0 || allowedRoles.includes(user.role)

//   // Vérification des permissions
//   let hasRequiredPermission = false
//   if (requiredPermissions.length > 0) {
//     const userPermissionNames = Array.isArray(user.permissions)
//       ? user.permissions.map(p => typeof p === 'object' ? p.name : p)
//       : []

//     hasRequiredPermission = requireAllPermissions
//       ? requiredPermissions.every(p => userPermissionNames.includes(p))
//       : requiredPermissions.some(p => userPermissionNames.includes(p))
//   } else {
//     hasRequiredPermission = true // pas de permission requise
//   }

//   // Condition OU : si le rôle est autorisé OU si la permission est suffisante
//   if (!hasAllowedRole && !hasRequiredPermission) {
//     console.warn(`Accès refusé: ni rôle ni permissions valides`)
//     return <Navigate to="/auth/not-access" replace />
//   }

//   // Autorisé
//   return children ? children : <Outlet />
// }

"use client"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Spin } from "antd"

export const ProtectedRoute = ({
  allowedRoles = [],                // ex: ["ADMIN","MEMBER"] ou ["ADMIN"]
  requiredPermissions = [],         // ex: ["GERER_ACTUALITES"]
  requireAllPermissions = false,    // true => toutes; false => au moins une
  children
}) => {
  const { user, isAuthenticated, loading, logout } = useAuth()

  // Pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    )
  }

  // Non authentifié
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  // Compte inactif
  if (user.status === "INACTIVE") {
    logout()
    return <Navigate to="/auth/lock-screen" replace />
  }

  const isSuperAdmin = user.role === "SUPER_ADMIN"
  if (isSuperAdmin) return children ? children : <Outlet />

  
  // Rôle
  const hasAllowedRole = allowedRoles.length === 0 || allowedRoles.includes(user.role)

  // Permissions
  const userPermissionNames = Array.isArray(user.permissions)
    ? user.permissions.map(p => (typeof p === "object" ? p.name : p))
    : []

  const hasRequiredPermission =
    requiredPermissions.length === 0
      ? true
      : (requireAllPermissions
        ? requiredPermissions.every(p => userPermissionNames.includes(p))
        : requiredPermissions.some(p => userPermissionNames.includes(p)))

  // ➜ AND logique: il faut un rôle autorisé ET (les) permission(s) requise(s)
  if (!(hasAllowedRole && hasRequiredPermission)) {
    console.warn("Accès refusé (rôle et/ou permission manquants)", {
      userRole: user.role,
      allowedRoles,
      userPermissions: userPermissionNames,
      requiredPermissions,
      requireAllPermissions
    })
    return <Navigate to="/auth/not-access" replace />
  }

  return children ? children : <Outlet />
}
