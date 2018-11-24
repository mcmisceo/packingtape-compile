# before
give @s minecraft:carrot_on_a_stick{CustomModelData:59}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"minecraft:carrot_on_a_stick",tag:{CustomModelData:59}}]}
execute if entity @s[nbt={SelectedItem:{id:"minecraft:carrot_on_a_stick",tag:{CustomModelData:59}}}]
# after
give @s $magiwell:magic_wand
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"$magiwell:magic_wand"}]}
execute if entity @s[nbt={SelectedItem:{id:"$magiwell:magic_wand"}}]
