// Id del rol administrador en la tabla roles (profiles.role_id)
export const idRolAdmin = 1;

// esRolAdmin: indica si el role_id de un perfil corresponde al rol administrador
export const esRolAdmin = (roleId: number | string | null | undefined) =>
  Number(roleId) === idRolAdmin;
