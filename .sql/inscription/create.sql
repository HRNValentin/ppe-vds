use ppe;

set default_storage_engine = InnoDb;
set foreign_key_checks = 1;

drop table if exists inscription;

create table inscription
(
    id            int auto_increment primary key,
    nom           varchar(100)   not null,
    dateEpreuve   date          not null,
    dateOuverture date          not null,
    dateCloture   date          not null,
    lienInscription varchar(250) not null,
    lienInscrit   varchar(250)  not null default '0'
);