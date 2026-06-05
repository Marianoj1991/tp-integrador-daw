/* 
  $ Aca se define un ENUM con los valores posibles que puede tomar un estado en una meta. 
  $ Ya vimos que en el backend tambien utilizamos un ENUM con los mismos valores, esto se hace para mantener consistencia en el sistema 
  y que los datos que se envien al backend y los que se reciban del backend sean siempre los mismos. 
 */
export enum EstadosMetasEnum {
  ACTIVO = 'ACTIVO',
  FINALIZADA = 'FINALIZADA',
  BAJA = 'BAJA',
}
