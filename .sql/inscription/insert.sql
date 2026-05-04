use ppe;

insert into inscription (id, nom, dateEpreuve, dateOuverture, dateCloture, lienInscription, lienInscrit)
values (1, 'Demi-finale des championnats de France de 5km', '2025-09-21', '2025-07-01', '2025-09-18', 'https://www.klikego.com/inscription/demi-finale-des-championnats-de-francede-5km-et-mile-sur-route-2025/running-course-a-pied/1603054434896-26 ', 'https://www.klikego.com/inscrits/demi-finale-des-championnats-de-france-de5km-et-mile-sur-route-2025/1603054434896-26 '),
       (2, 'Marathon d’Amiens-métropole et Semi-marathon du Val de Somme ', '2025-10-19', '2025-07-01', '2025-10-12', 'https://www.klikego.com/inscription/marathon-damiens-metropole-semimarathon-de-la-somme-2025/course-a-pied-running/1603054434896-23 ', 'https://www.klikego.com/inscrits/marathon-damiens-metropole-semi-marathonde-la-somme-2025/1603054434896-23   '),
       (3, 'Finale des 4 saisons ', '2025-11-02', '2025-09-08', '2025-10-30', 'non défini', 'non défini');

Select * from inscription;