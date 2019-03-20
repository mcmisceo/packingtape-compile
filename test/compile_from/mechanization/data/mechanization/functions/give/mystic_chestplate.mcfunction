give @s $mechanization:mystic_chestplate{foo:bar}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"$mechanization:mystic_chestplate"}]}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"$magilore:magic_wand"}]}
execute if entity @s[nbt={SelectedItem:{id:"$mechanization:mystic_chestplate",tag:{Enchantments:[{id:"minecraft:sharpness",lvl:5}]}}}]
