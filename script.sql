
DROP TABLE IF EXISTS animal CASCADE;
DROP TABLE IF EXISTS habitat CASCADE;
DROP TABLE IF EXISTS especie CASCADE;

CREATE TABLE especie (
    id              SERIAL PRIMARY KEY,
    nome_comum      VARCHAR(255) NOT NULL,
    nome_cientifico VARCHAR(255),
    grupo           VARCHAR(255)
);


CREATE TABLE habitat (
    id        SERIAL PRIMARY KEY,
    nome      VARCHAR(255) NOT NULL,
    tipo      VARCHAR(255) NOT NULL,
    descricao TEXT
);

CREATE TABLE animal (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    sexo            CHAR(1) NOT NULL,
    condicao_saude  VARCHAR(255) NOT NULL,
    especie_id      INTEGER NOT NULL REFERENCES especie(id),
    habitat_id      INTEGER NOT NULL REFERENCES habitat(id)
);


CREATE INDEX idx_animal_especie_id ON animal(especie_id);
CREATE INDEX idx_animal_habitat_id ON animal(habitat_id);


INSERT INTO especie (nome_comum, nome_cientifico, grupo) VALUES
('Leão',      'Panthera leo',              'Mamífero'),
('Elefante',  'Loxodonta africana',        'Mamífero'),
('Girafa',    'Giraffa camelopardalis',    'Mamífero'),
('Pinguim',   'Aptenodytes forsteri',      'Ave'),
('Cobra',     'Serpentes spp.',            'Réptil');


INSERT INTO habitat (nome, tipo, descricao) VALUES
('Savana 1',         'savana',   'Área ampla com gramíneas e poucas árvores'),
('Savana 2',         'savana',   'Área semelhante à Savana 1, para grandes felinos'),
('Aquário Polar',    'aquático', 'Ambiente frio para pinguins'),
('Terrário Répteis', 'deserto',  'Ambiente seco e quente para répteis'),
('Floresta Tropical','floresta', 'Ambiente úmido com vegetação densa');



INSERT INTO animal (nome, data_nascimento, sexo, condicao_saude, especie_id, habitat_id) VALUES
('Simba',     '2015-05-10', 'M', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Leão'),
 (SELECT id FROM habitat WHERE nome = 'Savana 2')),
('Nala',      '2016-08-15', 'F', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Leão'),
 (SELECT id FROM habitat WHERE nome = 'Savana 2')),
('Dumbo',     '2010-03-22', 'M', 'Em observação',
 (SELECT id FROM especie WHERE nome_comum = 'Elefante'),
 (SELECT id FROM habitat WHERE nome = 'Savana 1')),
('Ellie',     '2012-11-05', 'F', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Elefante'),
 (SELECT id FROM habitat WHERE nome = 'Savana 1')),
('Longneck',  '2018-01-30', 'M', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Girafa'),
 (SELECT id FROM habitat WHERE nome = 'Floresta Tropical')),
('Spot',      '2019-07-19', 'F', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Girafa'),
 (SELECT id FROM habitat WHERE nome = 'Floresta Tropical')),
('Pingo',     '2020-02-01', 'M', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Pinguim'),
 (SELECT id FROM habitat WHERE nome = 'Aquário Polar')),
('Fria',      '2019-12-11', 'F', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Pinguim'),
 (SELECT id FROM habitat WHERE nome = 'Aquário Polar')),
('Slytherin', '2014-09-09', 'M', 'Em tratamento',
 (SELECT id FROM especie WHERE nome_comum = 'Cobra'),
 (SELECT id FROM habitat WHERE nome = 'Terrário Répteis')),
('Víbora',    '2013-04-25', 'F', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Cobra'),
 (SELECT id FROM habitat WHERE nome = 'Terrário Répteis'));

INSERT INTO animal (nome, data_nascimento, sexo, condicao_saude, especie_id, habitat_id) VALUES
('Mufasa', '2012-03-01', 'M', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Leão'),
 (SELECT id FROM habitat WHERE nome = 'Savana 2')),
('Scar',   '2013-07-22', 'M', 'Em observação',
 (SELECT id FROM especie WHERE nome_comum = 'Leão'),
 (SELECT id FROM habitat WHERE nome = 'Savana 2')),
('Kion',   '2019-09-10', 'M', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Leão'),
 (SELECT id FROM habitat WHERE nome = 'Savana 2'));


INSERT INTO animal (nome, data_nascimento, sexo, condicao_saude, especie_id, habitat_id) VALUES
('Babar', '2009-11-30', 'M', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Elefante'),
 (SELECT id FROM habitat WHERE nome = 'Savana 1')),
('Manny', '2011-04-05', 'M', 'Em observação',
 (SELECT id FROM especie WHERE nome_comum = 'Elefante'),
 (SELECT id FROM habitat WHERE nome = 'Savana 1'));


INSERT INTO animal (nome, data_nascimento, sexo, condicao_saude, especie_id, habitat_id) VALUES
('Ruby',   '2020-06-18', 'F', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Girafa'),
 (SELECT id FROM habitat WHERE nome = 'Floresta Tropical')),
('Sky',    '2021-02-09', 'F', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Girafa'),
 (SELECT id FROM habitat WHERE nome = 'Floresta Tropical')),
('Twiggy', '2017-10-01', 'F', 'Em observação',
 (SELECT id FROM especie WHERE nome_comum = 'Girafa'),
 (SELECT id FROM habitat WHERE nome = 'Floresta Tropical'));


INSERT INTO animal (nome, data_nascimento, sexo, condicao_saude, especie_id, habitat_id) VALUES
('Skipper',  '2018-03-12', 'M', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Pinguim'),
 (SELECT id FROM habitat WHERE nome = 'Aquário Polar')),
('Kowalski', '2018-03-12', 'M', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Pinguim'),
 (SELECT id FROM habitat WHERE nome = 'Aquário Polar')),
('Rico',     '2018-03-12', 'M', 'Em tratamento',
 (SELECT id FROM especie WHERE nome_comum = 'Pinguim'),
 (SELECT id FROM habitat WHERE nome = 'Aquário Polar')),
('Private',  '2019-01-20', 'M', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Pinguim'),
 (SELECT id FROM habitat WHERE nome = 'Aquário Polar'));


INSERT INTO animal (nome, data_nascimento, sexo, condicao_saude, especie_id, habitat_id) VALUES
('Nagini',   '2015-01-01', 'F', 'Em tratamento',
 (SELECT id FROM especie WHERE nome_comum = 'Cobra'),
 (SELECT id FROM habitat WHERE nome = 'Terrário Répteis')),
('Python',   '2016-05-15', 'M', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Cobra'),
 (SELECT id FROM habitat WHERE nome = 'Terrário Répteis')),
('Cascavel', '2017-08-08', 'F', 'Em observação',
 (SELECT id FROM especie WHERE nome_comum = 'Cobra'),
 (SELECT id FROM habitat WHERE nome = 'Terrário Répteis')),
('Coral',    '2018-12-02', 'F', 'Saudável',
 (SELECT id FROM especie WHERE nome_comum = 'Cobra'),
 (SELECT id FROM habitat WHERE nome = 'Terrário Répteis'));
