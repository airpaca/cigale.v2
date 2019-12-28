<?php 

include '../pg_functions.php';

$sql ='


-- Affectation des ratios
select a.id_comm, a.id_param, coalesce(a.val_t_brut,0) as val_t_brut, b.ratio_mobilisation_pct, 
case when a.id_param in (22, 23, 24, 25, 27) then coalesce(a.val_t_net,0) -- 27=vin on a direct en t net 22=equins en t net également, pailles aussi
else a.val_t_brut*b.ratio_mobilisation_pct/100 end as val_t_net_calcule,
b.ratio_pom_m3ch4_t, 
Case when a.id_param in (16,21,27) then coalesce(a.val_m3ch4_net,0) -- pas de PoM fixe pour IAA scde trasnfo, elevages hors equin, vin car variable selon les communes/cantons
Else 	case when a.id_param in (22, 23,24, 25) then coalesce(a.val_t_net,0)*b.ratio_pom_m3ch4_t -- on ne connait la valeur brute donc on prend directement la valeur nette (equins et pailles)
	Else 	case when a.id_param in (29) and a.val_t_brut<5 then null -- pour les grignos, si t<5 on n estime pas les m3Ch4
		Else coalesce(a.val_t_brut*b.ratio_mobilisation_pct/100,0)*b.ratio_pom_m3ch4_t -- tonnage brute * ratio mobilisation * PoM
		End
	End
end as val_m3ch4_net_calcule,
b.memo,
case when a.id_param in (27) then 'vin: pas de ratios, on a direct les valeurs en t_net et m3_net pour tous les types deffluents mélangés' --REMPLACER GUILLEMENTS PAR APOSTROPHE
else 	case when a.id_param in (16, 21) then 'pas de PoM fixe:variable selon les communes'--REMPLACER GUILLEMENTS PAR APOSTROPHE
		Else Case when a.id_param in (23, 24, 25) then 'pas de valeurs brutes pour les pailles riz/céreales/menues pailles, uniquement en net'--REMPLACER GUILLEMENTS PAR APOSTROPHE
			Else Case when a.id_param in (29) and a.val_t_brut<5 then 'quand la donnée est <5 t MB, on ne fait pas le calcul en m3ch4 '--REMPLACER GUILLEMENTS PAR APOSTROPHE
				Else NULL 
				END
		END
	END
ENd as commentaire
from (select * from geres.rom_donnees_commune where id_param not in (5,12,13,20)) as a
left join geres.rom_tpk_param as b using (id_param)
order by id_param, id_comm














-- Création des groupes et totaux
DROP TABLE IF EXISTS public.toto;
CREATE TABLE public.toto AS 


with a as (
	SELECT id_comm, id_groupe_rom, sum(val_m3ch4_net_calcule) * 9.7 / 1000. AS val 
	fROM geres.rom_bilan_comm as a 
	left join geres.rom_tpk_param as b using (id_param)
	group by id_comm, id_groupe_rom
)

select a.*, b.nom_com, b.geom
from (
select a.id_comm, b.val as "Déchets collectivités (MWh)", c.val as "Déchets distribution (MWh)", d.val as "Déchets sous-produits (MWh)", e.val as "Déchets agricoles (MWh)", f.val as "Total potentiel rom (MWh)"
from (select distinct id_comm from a) as a
left join (select * from a where id_groupe_rom = 1) as b using (id_comm)
left join (select * from a where id_groupe_rom = 2) as c using (id_comm)
left join (select * from a where id_groupe_rom = 3) as d using (id_comm)
left join (select * from a where id_groupe_rom = 4) as e using (id_comm)
left join (select id_comm, sum(val) as val from a group by id_comm) as f using (id_comm)
) as a 
left join geres.alp_comm AS b ON a.id_comm = b.insee_com::integer 
order by id_comm
';

execute_sql($sql);
?>
